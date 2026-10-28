/* Header notification center. Reuses the dashboard event snapshot; no extra polling. */
(() => {
    "use strict";

    const MAX_ITEMS = 10;
    const MAX_SEEN = 300;
    const STORAGE_PREFIX = "keroro:notifications:seen:";
    const state = {
        ready: false,
        open: false,
        language: "th",
        user: "dashboard-user",
        items: [],
        seen: new Set(),
        visibleUnread: new Set(),
        closeTimer: null,
        lastSignature: "",
        lastUnreadCount: 0,
    };

    const $ = id => document.getElementById(id);
    const copy = {
        th: {
            title: "การแจ้งเตือนล่าสุด",
            subtitle: "เหตุการณ์ล่าสุดจาก 10 IP",
            empty: "ยังไม่มีเหตุการณ์ความปลอดภัย",
            updated: "อัปเดตอัตโนมัติ",
            unread: count => `${count} รายการที่ยังไม่ได้อ่าน`,
            open: "เปิดการแจ้งเตือน",
            close: "ปิดการแจ้งเตือน",
            HIGH: "สูง",
            MEDIUM: "ปานกลาง",
            LOW: "ต่ำ",
        },
        en: {
            title: "Recent notifications",
            subtitle: "Latest events from 10 IPs",
            empty: "No security events yet",
            updated: "Updates automatically",
            unread: count => `${count} unread ${count === 1 ? "item" : "items"}`,
            open: "Open notifications",
            close: "Close notifications",
            HIGH: "High",
            MEDIUM: "Medium",
            LOW: "Low",
        },
    };

    function text(key, value) {
        const entry = copy[state.language]?.[key] ?? copy.th[key] ?? key;
        return typeof entry === "function" ? entry(value) : entry;
    }

    function eventTime(event) {
        const raw = String(event?.time || event?.minute || "");
        const normalized = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(raw) ? `${raw}:00Z` : raw;
        const value = Date.parse(normalized);
        return Number.isFinite(value) ? value : 0;
    }

    function eventKey(event) {
        if (event?.event_id) return String(event.event_id);
        const reasons = Array.isArray(event?.reasons) ? event.reasons.join(",") : "";
        return `${event?.ip || "unknown"}|${event?.time || event?.minute || ""}|${reasons}`;
    }

    function latestUnique(events) {
        const byIp = new Map();
        for (const event of Array.isArray(events) ? events : []) {
            const ip = String(event?.ip || "").trim();
            if (!ip) continue;
            const current = byIp.get(ip);
            if (!current || eventTime(event) > eventTime(current)) byIp.set(ip, event);
        }
        return [...byIp.values()]
            .sort((left, right) => eventTime(right) - eventTime(left) || eventKey(right).localeCompare(eventKey(left)))
            .slice(0, MAX_ITEMS);
    }

    function storageKey() {
        return `${STORAGE_PREFIX}${state.user}`;
    }

    function loadSeen() {
        try {
            const values = JSON.parse(localStorage.getItem(storageKey()) || "[]");
            state.seen = new Set(Array.isArray(values) ? values.slice(-MAX_SEEN) : []);
        } catch (_) {
            state.seen = new Set();
        }
    }

    function saveSeen() {
        try {
            localStorage.setItem(storageKey(), JSON.stringify([...state.seen].slice(-MAX_SEEN)));
        } catch (_) {
            // The notification center still works when storage is unavailable.
        }
    }

    function formatTime(event) {
        const timestamp = eventTime(event);
        if (!timestamp) return "—";
        return new Intl.DateTimeFormat(state.language === "th" ? "th-TH" : "en-GB", {
            timeZone: "Asia/Bangkok",
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        }).format(new Date(timestamp));
    }

    function reason(event) {
        if (state.language === "th" && event?.reason_th) return String(event.reason_th);
        const reasons = Array.isArray(event?.reasons) ? event.reasons : [];
        if (reasons.length) return reasons.map(value => String(value).replaceAll("_", " ")).join(" · ");
        if (Array.isArray(event?.evidence) && event.evidence[0]) return String(event.evidence[0]);
        return state.language === "th" ? "ตรวจพบรูปแบบการเข้าถึงที่ควรตรวจสอบ" : "Access pattern requires review";
    }

    function unreadItems() {
        return state.items.filter(item => !state.seen.has(eventKey(item)));
    }

    function renderBadge() {
        const badge = $("notificationBadge");
        const trigger = $("notificationTrigger");
        if (!badge || !trigger) return;
        const count = state.open ? 0 : unreadItems().length;
        badge.hidden = count === 0;
        badge.textContent = count > 9 ? "9+" : String(count);
        trigger.classList.toggle("has-unread", count > 0);
        if (count > state.lastUnreadCount) {
            trigger.classList.remove("is-alerting");
            void trigger.offsetWidth;
            trigger.classList.add("is-alerting");
        } else if (!count) {
            trigger.classList.remove("is-alerting");
        }
        state.lastUnreadCount = count;
        trigger.setAttribute("aria-label", count ? `${text("open")} · ${text("unread", count)}` : text("open"));
    }

    function createItem(event) {
        const key = eventKey(event);
        const item = document.createElement("article");
        item.className = "notification-item";
        if (state.visibleUnread.has(key)) item.classList.add("is-unread");

        const marker = document.createElement("span");
        marker.className = `notification-severity notification-severity--${String(event?.severity || "LOW").toLowerCase()}`;
        marker.setAttribute("aria-hidden", "true");

        const body = document.createElement("div");
        body.className = "notification-item-body";
        const top = document.createElement("div");
        top.className = "notification-item-top";
        const ip = document.createElement("strong");
        ip.textContent = String(event?.ip || "—");
        const time = document.createElement("time");
        time.dateTime = String(event?.time || event?.minute || "");
        time.textContent = formatTime(event);
        top.append(ip, time);

        const detail = document.createElement("p");
        detail.textContent = reason(event);
        const meta = document.createElement("div");
        meta.className = "notification-item-meta";
        const severity = document.createElement("span");
        const level = String(event?.severity || "LOW").toUpperCase();
        severity.className = `notification-risk notification-risk--${level.toLowerCase()}`;
        severity.textContent = text(level);
        const requests = document.createElement("span");
        requests.textContent = state.language === "th"
            ? `${Number(event?.total_requests || 0).toLocaleString("th-TH")} คำขอ`
            : `${Number(event?.total_requests || 0).toLocaleString("en-US")} requests`;
        meta.append(severity, requests);
        body.append(top, detail, meta);
        item.append(marker, body);
        return item;
    }

    function renderPanel() {
        if (!state.ready) return;
        $("notificationTitle").textContent = text("title");
        $("notificationSubtitle").textContent = text("subtitle");
        $("notificationLiveText").textContent = text("updated");
        $("notificationClose").setAttribute("aria-label", text("close"));
        const list = $("notificationList");
        list.replaceChildren();
        if (!state.items.length) {
            const empty = document.createElement("div");
            empty.className = "notification-empty";
            empty.textContent = text("empty");
            list.appendChild(empty);
        } else {
            list.append(...state.items.map(createItem));
        }
        renderBadge();
    }

    function markVisibleRead() {
        for (const item of state.items) state.seen.add(eventKey(item));
        saveSeen();
        renderBadge();
    }

    function openPanel() {
        if (state.open) return;
        state.open = true;
        clearTimeout(state.closeTimer);
        state.visibleUnread = new Set(unreadItems().map(eventKey));
        renderPanel();
        const panel = $("notificationPanel");
        panel.hidden = false;
        $("notificationTrigger").setAttribute("aria-expanded", "true");
        requestAnimationFrame(() => panel.classList.add("is-open"));
        markVisibleRead();
    }

    function closePanel({focus = false} = {}) {
        if (!state.open) return;
        state.open = false;
        state.visibleUnread.clear();
        const panel = $("notificationPanel");
        panel.classList.remove("is-open");
        $("notificationTrigger").setAttribute("aria-expanded", "false");
        state.closeTimer = window.setTimeout(() => { panel.hidden = true; }, 230);
        renderBadge();
        if (focus) $("notificationTrigger").focus();
    }

    function togglePanel() {
        if (state.open) closePanel();
        else openPanel();
    }

    async function resolveUser() {
        try {
            const response = await fetch(`${window.KeroroDashboardConfig.apiBase}/session`, {credentials: "same-origin", cache: "no-store"});
            if (!response.ok) return;
            const session = await response.json();
            if (session?.user) {
                state.user = String(session.user).replace(/[^a-zA-Z0-9_.@-]/g, "_").slice(0, 80);
                loadSeen();
                renderPanel();
            }
        } catch (_) {
            // Keep the local fallback identity when the session endpoint is unavailable.
        }
    }

    function init() {
        if (state.ready) return;
        state.ready = true;
        loadSeen();
        $("notificationTrigger").addEventListener("click", togglePanel);
        $("notificationClose").addEventListener("click", () => closePanel({focus: true}));
        document.addEventListener("click", event => {
            if (state.open && !$("notificationCenter").contains(event.target)) closePanel();
        });
        document.addEventListener("keydown", event => {
            if (state.open && event.key === "Escape") closePanel({focus: true});
        });
        renderPanel();
        resolveUser();
        if (typeof dataCache !== "undefined" && dataCache) {
            update(dataCache.events, {
                language: typeof language === "string" ? language : "th",
                force: true,
            });
        }
    }

    function update(events, options = {}) {
        state.language = options.language === "en" ? "en" : "th";
        const next = latestUnique(events);
        const signature = next.map(eventKey).join("|");
        state.items = next;
        if (state.open) {
            for (const item of next) state.seen.add(eventKey(item));
            saveSeen();
        }
        if (signature !== state.lastSignature || options.force || state.open) {
            state.lastSignature = signature;
            renderPanel();
        } else {
            renderBadge();
        }
    }

    window.dashboardNotifications = Object.freeze({update});
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, {once: true});
    else init();
})();
