/* Dashboard IP enforcement. All mutations go through the authenticated API. */
(() => {
    "use strict";
    const byId = id => document.getElementById(id);
    const config = window.KeroroDashboardConfig;
    const api = config.apiBase;
    const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"})[ch]);
    const words = {
        th: {
            title: "การบล็อก IP", intro: "ตรวจสอบ IP ที่ถูกบล็อกและปลดบล็อกพร้อมบันทึกเหตุผล",
            permanent: "บล็อกถาวร", cooldown: "พักการเข้าถึง", unblockedCount: "ถูกปลดบล็อก", pending: "รอดำเนินการ/ผิดพลาด",
            search: "ค้นหา IP", status: "สถานะ", refresh: "รีเฟรช", active: "กำลังบล็อก",
            history: "ประวัติการปลดบล็อก", ip: "IP", reason: "สาเหตุ", time: "เริ่มบล็อก",
            expiry: "สิ้นสุด", action: "จัดการ", review: "ดูรายละเอียด", previous: "ก่อนหน้า", next: "ถัดไป",
            noBlocks: "ไม่พบ IP ในสถานะนี้", loadError: "โหลดข้อมูลการบล็อกไม่สำเร็จ", refreshDone: "อัปเดตสถานะการบล็อกเรียบร้อยแล้ว", refreshTitle: "รีเฟรชสำเร็จ", errorTitle: "ดำเนินการไม่สำเร็จ", waitTitle: "กำลังดำเนินการ", waitMessage: "กรุณารอสักครู่ก่อนดำเนินการอีกครั้ง",
            failed: "ซิงก์ผิดพลาด", applied: "บังคับใช้แล้ว", syncPending: "รอซิงก์", unblocked: "ปลดบล็อกแล้ว",
            permanentExpiry: "ไม่หมดอายุ", detail: "รายละเอียด IP", firstSeen: "พบครั้งแรก", lastSeen: "พบล่าสุด",
            policy: "รุ่นนโยบาย", evidence: "หลักฐาน", audit: "ประวัติการจัดการ", actor: "ผู้ดำเนินการ",
            confirm: "พิมพ์ IP เพื่อยืนยัน", unblockReason: "เหตุผลการปลดบล็อก (อย่างน้อย 8 ตัวอักษร)",
            unblock: "ยืนยันการปลดบล็อก", invalid: "โปรดพิมพ์ IP ให้ตรงและระบุเหตุผลอย่างน้อย 8 ตัวอักษร",
            requested: "รับคำขอปลดบล็อกแล้ว กำลังยืนยันผลที่ firewall", done: "ปลดบล็อกสำเร็จและตรวจสอบ firewall แล้ว",
            actionError: "ดำเนินการไม่สำเร็จ โปรดรีเฟรชสถานะ", page: "รายการ",
            sortBy: "เรียงตาม", rowsPerPage: "แสดงต่อหน้า", sortNewest: "ล่าสุดก่อน", sortOldest: "เก่าสุดก่อน", sortBlockStatus: "สถานะบล็อกก่อน", sortIp: "หมายเลข IP",
            otpStepLabel: "ขั้นตอนสุดท้าย · ยืนยันทางอีเมล", otpTitle: "ยืนยันรหัสก่อนปลดบล็อก",
            otpDescription: "กรอกรหัส 6 หลักที่ส่งไปยังอีเมลผู้ดูแล", otpIpLabel: "IP ที่จะปลดบล็อก",
            otpCodeLabel: "รหัสยืนยัน 6 หลัก", otpResend: "ส่งรหัสอีกครั้ง", otpBack: "ย้อนกลับ", otpConfirm: "ยืนยันและปลดบล็อก",
            otpSending: "กำลังส่งรหัสยืนยัน...", otpSent: "ส่งรหัสไปที่ ke••••••team@gmail.com แล้ว", otpSendError: "ส่งอีเมลไม่สำเร็จ ลองส่งอีกครั้ง",
            otpWait: "ส่งอีกครั้งได้ใน {seconds} วินาที", otpReady: "ส่งรหัสอีกครั้ง", otpExpires: "รหัสหมดอายุใน {minutes}:{seconds}", otpExpired: "รหัสหมดอายุแล้ว กรุณาขอรหัสใหม่",
            otpInvalid: "กรอกรหัสตัวเลข 6 หลัก", otpChecking: "กำลังตรวจสอบรหัส...", otpWrong: "รหัสไม่ถูกต้อง ลองกรอกอีกครั้ง", otpAttempts: "เหลือ {count} ครั้ง",
            otpStale: "ข้อมูลการบล็อกเปลี่ยนไป กรุณาเปิดรายการใหม่", otpLimit: "ขอรหัสบ่อยเกินไป กรุณารอสักครู่",
        },
        en: {
            title: "IP Enforcement", intro: "Review blocked IPs and unblock with an audited reason",
            permanent: "Permanent blocks", cooldown: "Cooldowns", unblockedCount: "Unblocked", pending: "Pending / failed",
            search: "Search IP", status: "Status", refresh: "Refresh", active: "Active blocks",
            history: "Unblock history", ip: "IP", reason: "Reason", time: "Blocked at",
            expiry: "Expires", action: "Action", review: "Review", previous: "Previous", next: "Next",
            noBlocks: "No IPs in this state", loadError: "Could not load enforcement state", refreshDone: "Block status is up to date", refreshTitle: "Refresh complete", errorTitle: "Action failed", waitTitle: "Action in progress", waitMessage: "Please wait before trying again",
            failed: "Sync failed", applied: "Applied", syncPending: "Sync pending", unblocked: "Unblocked",
            permanentExpiry: "Never", detail: "IP details", firstSeen: "First seen", lastSeen: "Last seen",
            policy: "Policy version", evidence: "Evidence", audit: "Action history", actor: "Actor",
            confirm: "Type the IP to confirm", unblockReason: "Unblock reason (at least 8 characters)",
            unblock: "Confirm unblock", invalid: "Type the exact IP and give a reason of at least 8 characters",
            requested: "Unblock requested. Waiting for firewall verification", done: "Unblocked and verified in firewall",
            actionError: "Action failed; refresh the state", page: "Items",
            sortBy: "Sort by", rowsPerPage: "Rows", sortNewest: "Newest first", sortOldest: "Oldest first", sortBlockStatus: "Block status first", sortIp: "IP address",
            otpStepLabel: "Final step · Email verification", otpTitle: "Verify before unblocking",
            otpDescription: "Enter the six-digit code sent to the administrator email", otpIpLabel: "IP to unblock",
            otpCodeLabel: "Six-digit verification code", otpResend: "Resend code", otpBack: "Back", otpConfirm: "Verify and unblock",
            otpSending: "Sending verification code...", otpSent: "Code sent to ke••••••team@gmail.com", otpSendError: "Could not send email. Please try again",
            otpWait: "Resend in {seconds}s", otpReady: "Resend code", otpExpires: "Code expires in {minutes}:{seconds}", otpExpired: "Code expired. Request a new one",
            otpInvalid: "Enter a six-digit code", otpChecking: "Verifying code...", otpWrong: "Incorrect code. Please try again", otpAttempts: "{count} attempts left",
            otpStale: "Block state changed. Open the entry again", otpLimit: "Too many code requests. Please wait",
        }
    };
    const lang = () => (typeof language !== "undefined" && language === "en") ? "en" : "th";
    const tr = key => words[lang()][key] || key;
    const state = {cursor: 0, next: null, limit: 10, total: 0, loading: false, session: null, selected: null, searchTimer: null,
        otp: null, otpBusy: false, otpTicker: null};
    const fill = (key, values) => tr(key).replace(/\{(\w+)\}/g, (_, name) => String(values[name] ?? ""));
    const notify = (type, title, value, key) => window.dashboardNotify?.show({type, title, message: value, key});
    const waitLockedAction = key => window.dashboardNotify?.actions?.wait(key, {title: tr("waitTitle"), message: tr("waitMessage")});
    const beginAction = key => window.dashboardNotify?.actions?.begin(key) ?? true;
    const finishAction = (key, type, title, value) => window.dashboardNotify?.actions?.finish(key, {type, title, message: value});

    function formatTime(value) {
        if (!value) return "—";
        const date = new Date(value);
        return Number.isNaN(date.valueOf()) ? "—" : date.toLocaleString(lang() === "th" ? "th-TH" : "en-US");
    }
    function statusLabel(item) {
        if (item.enforcement_status === "FAILED") return [tr("failed"), "failed"];
        if (item.desired_status === "UNBLOCK_PENDING" || item.enforcement_status === "PENDING") return [tr("syncPending"), "pending"];
        if (item.desired_status === "PERMANENT_BLOCK") return [tr("permanent"), "permanent"];
        if (item.desired_status === "COOLDOWN") return [tr("cooldown"), "cooldown"];
        return [tr("unblocked"), "unblocked"];
    }
    function message(value, error = false) {
        if (value) notify(error ? "error" : "success", error ? tr("errorTitle") : tr("refreshTitle"), value, "enforcement-action");
    }
    async function getJSON(url, options = {}) {
        const response = await fetch(url, {credentials: "same-origin", cache: "no-store", ...options});
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            const error = new Error(data.error || `HTTP ${response.status}`);
            error.status = response.status;
            error.data = data;
            throw error;
        }
        return data;
    }
    function pageNumbers(current, total) {
        if (total <= 7) return Array.from({length: total}, (_, index) => index + 1);
        const pages = [1];
        const start = Math.max(2, current - 1);
        const end = Math.min(total - 1, current + 1);
        if (start > 2) pages.push("…");
        for (let page = start; page <= end; page++) pages.push(page);
        if (end < total - 1) pages.push("…");
        pages.push(total);
        return pages;
    }
    function renderPagination() {
        const totalPages = Math.max(1, Math.ceil(state.total / state.limit));
        const current = Math.min(totalPages, Math.floor(state.cursor / state.limit) + 1);
        const first = state.total ? state.cursor + 1 : 0;
        const last = Math.min(state.cursor + state.limit, state.total);
        byId("blockPageSummary").textContent = `${tr("page")} ${first}–${last} / ${state.total}`;
        const controls = [
            `<button class="page-btn" type="button" data-page-action="prev" ${current === 1 ? "disabled" : ""}>${escapeHtml(tr("previous"))}</button>`,
            ...pageNumbers(current, totalPages).map(page => page === "…"
                ? `<span class="page-ellipsis">…</span>`
                : `<button class="page-btn ${page === current ? "active" : ""}" type="button" data-page="${page}" ${page === current ? "aria-current=\"page\"" : ""}>${page}</button>`),
            `<button class="page-btn" type="button" data-page-action="next" ${current === totalPages || state.next === null ? "disabled" : ""}>${escapeHtml(tr("next"))}</button>`,
        ];
        byId("blockPaginationButtons").innerHTML = controls.join("");
    }
    async function loadSummary() {
        try {
            const data = await getJSON(config.blocksSummaryUrl);
            byId("permanentBlockCount").textContent = data.permanent ?? 0;
            byId("cooldownBlockCount").textContent = data.cooldown ?? 0;
            byId("unblockedCount").textContent = data.unblocked ?? 0;
        } catch (_) { /* list error is surfaced separately */ }
        const storage = typeof dataCache !== "undefined" ? dataCache?.storage : null;
        byId("storageNotice").hidden = !storage?.warning;
        if (storage?.warning) byId("storageNotice").textContent = lang() === "th"
            ? `พื้นที่เก็บ log ใช้ไป ${storage.used_percent}% (${storage.warning}) — โปรดตรวจสอบการสำรองและพื้นที่ดิสก์`
            : `Log storage is ${storage.used_percent}% full (${storage.warning}) — check archive and disk capacity`;
    }
    function applyText() {
        const mapping = {
            enforcementTitle: "title", enforcementIntro: "intro", permanentBlockLabel: "permanent",
            cooldownBlockLabel: "cooldown", unblockedLabel: "unblockedCount", blockSearchLabel: "search",
            blockFilterLabel: "status", blockRefresh: "refresh", blockThIp: "ip", blockThStatus: "status",
            blockThReason: "reason", blockThTime: "time", blockThExpiry: "expiry", blockThAction: "action",
            blockSortLabel: "sortBy", blockPageSizeLabel: "rowsPerPage",
            confirmIpLabel: "confirm",
            unblockReasonLabel: "unblockReason", unblockSubmit: "unblock",
            otpStepLabel: "otpStepLabel", otpTitle: "otpTitle", otpDescription: "otpDescription",
            otpIpLabel: "otpIpLabel", otpCodeLabel: "otpCodeLabel", otpBack: "otpBack", otpConfirm: "otpConfirm",
        };
        for (const [id, key] of Object.entries(mapping)) byId(id).textContent = tr(key);
        const select = byId("blockFilter");
        for (const option of select.options) option.textContent = tr(({active:"active",PERMANENT_BLOCK:"permanent",COOLDOWN:"cooldown",history:"history"})[option.value]);
        const sort = byId("blockSort");
        for (const option of sort.options) option.textContent = tr(({newest:"sortNewest",oldest:"sortOldest",status:"sortBlockStatus",ip:"sortIp"})[option.value]);
        updateOtpTimer();
    }
    function renderList(data) {
        const body = byId("blockRows");
        if (!data.items.length) {
            body.innerHTML = `<tr><td colspan="6">${escapeHtml(tr("noBlocks"))}</td></tr>`;
        } else {
            body.innerHTML = data.items.map(item => {
                const [label, className] = statusLabel(item);
                const expiry = item.desired_status === "PERMANENT_BLOCK" ? tr("permanentExpiry") : formatTime(item.expires_at);
                return `<tr><td><code>${escapeHtml(item.ip)}</code></td>
                    <td><span class="enforcement-badge ${className}">${escapeHtml(label)}</span></td>
                    <td>${escapeHtml((item.reason_codes || []).join(", "))}</td>
                    <td><time title="${escapeHtml(item.created_at || "")}">${escapeHtml(formatTime(item.created_at))}</time></td>
                    <td><time title="${escapeHtml(item.expires_at || "")}">${escapeHtml(expiry)}</time></td>
                    <td><button class="enforcement-view" type="button" data-ip="${escapeHtml(item.ip)}">${escapeHtml(tr("review"))}</button></td></tr>`;
            }).join("");
        }
        state.total = data.total;
        state.next = data.next_cursor;
        renderPagination();
    }
    async function loadList(quiet = false, feedback = false) {
        if (state.loading) { if (feedback) waitLockedAction("block-refresh"); return; }
        if (feedback && !beginAction("block-refresh")) { waitLockedAction("block-refresh"); return; }
        state.loading = true;
        const refreshButton = byId("blockRefresh");
        if (feedback) window.dashboardButtonBusy?.(refreshButton, true);
        try {
            const params = new URLSearchParams({status: byId("blockFilter").value, search: byId("blockSearch").value.trim(), sort: byId("blockSort").value, cursor: state.cursor, limit: state.limit});
            const data = await getJSON(`${api}/blocks?${params}`);
            renderList(data);
            if (feedback) finishAction("block-refresh", "success", tr("refreshTitle"), tr("refreshDone"));
        } catch (error) {
            if (feedback) finishAction("block-refresh", "error", tr("errorTitle"), `${tr("loadError")}: ${error.message}`);
            else notify("error", tr("errorTitle"), `${tr("loadError")}: ${error.message}`, "block-refresh");
        } finally {
            state.loading = false;
            if (feedback) window.dashboardButtonBusy?.(refreshButton, false);
        }
        await loadSummary();
    }
    async function session() {
        try { state.session = await getJSON(`${api}/session`); }
        catch (_) { state.session = {can_unblock: false}; }
    }
    async function openDetail(ip) {
        try {
            const data = await getJSON(`${api}/blocks/${encodeURIComponent(ip)}`);
            const item = data.block;
            state.selected = item;
            const [label] = statusLabel(item);
            byId("blockDialogTitle").textContent = `${tr("detail")}: ${ip}`;
            const fields = [
                [tr("status"), `${label} / ${item.enforcement_status}`],
                [tr("reason"), (item.reason_codes || []).join(", ")],
                [tr("firstSeen"), formatTime(item.first_seen_at)],
                [tr("lastSeen"), formatTime(item.last_seen_at)],
                [tr("time"), formatTime(item.created_at)],
                [tr("expiry"), item.expires_at ? formatTime(item.expires_at) : tr("permanentExpiry")],
                [tr("policy"), item.policy_version || "—"],
                [tr("evidence"), (item.evidence_event_ids || []).join(", ") || "—"],
            ];
            const history = (data.history || []).map(action => `<p><time title="${escapeHtml(action.timestamp)}">${escapeHtml(formatTime(action.timestamp))}</time> · ${escapeHtml(action.action)} · ${escapeHtml(action.actor)} · ${escapeHtml(action.reason)}</p>`).join("");
            byId("blockDetailBody").innerHTML = `<dl class="block-detail-grid">${fields.map(([key, value]) => `<dt>${escapeHtml(key)}</dt><dd>${escapeHtml(value)}</dd>`).join("")}</dl><div class="block-history"><strong>${escapeHtml(tr("audit"))}</strong>${history}</div>`;
            const form = byId("unblockForm");
            form.hidden = !(data.can_unblock && ["PERMANENT_BLOCK", "COOLDOWN"].includes(item.desired_status));
            byId("confirmBlockIp").value = "";
            byId("unblockReason").value = "";
            byId("unblockError").textContent = "";
            byId("blockReviewStep").hidden = false;
            byId("blockOtpStep").hidden = true;
            byId("blockDetailDialog").setAttribute("aria-labelledby", "blockDialogTitle");
            byId("blockDetailDialog").showModal();
        } catch (error) { message(`${tr("loadError")}: ${error.message}`, true); }
    }
    async function waitAction(actionId) {
        for (let attempt = 0; attempt < 12; attempt++) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const result = await getJSON(`${api}/actions/${actionId}`);
            if (result.block?.desired_status === "UNBLOCKED" && result.block?.enforcement_status === "APPLIED") return true;
            if (result.block?.enforcement_status === "FAILED") return false;
        }
        return false;
    }
    function updateOtpTimer() {
        const otp = state.otp;
        if (!otp) return;
        const now = Date.now() / 1000;
        const remaining = Math.max(0, Math.ceil((otp.expiresAt || 0) - now));
        const wait = Math.max(0, Math.ceil((otp.resendAt || 0) - now));
        byId("otpExpiry").textContent = otp.challengeId
            ? (remaining ? fill("otpExpires", {minutes: Math.floor(remaining / 60), seconds: String(remaining % 60).padStart(2, "0")}) : tr("otpExpired"))
            : "";
        byId("otpResend").textContent = wait ? fill("otpWait", {seconds: wait}) : tr("otpReady");
        byId("otpResend").disabled = state.otpBusy || wait > 0;
        const confirmButton = byId("otpConfirm");
        confirmButton.disabled = !otp.challengeId || !remaining || otp.attemptsRemaining === 0 || !/^[0-9]{6}$/.test(byId("blockOtpCode").value);
        confirmButton.classList.toggle("ui-action-busy", state.otpBusy);
        confirmButton.setAttribute("aria-busy", String(state.otpBusy));
    }
    function showOtpStep() {
        byId("blockReviewStep").hidden = true;
        byId("blockOtpStep").hidden = false;
        byId("blockDetailDialog").setAttribute("aria-labelledby", "otpTitle");
        byId("otpTargetIp").textContent = state.otp.ip;
        byId("blockOtpCode").value = "";
        byId("otpError").textContent = "";
        byId("otpDeliveryStatus").textContent = tr("otpSending");
        byId("otpDeliveryStatus").dataset.state = "sending";
        clearInterval(state.otpTicker);
        state.otpTicker = setInterval(updateOtpTimer, 1000);
        updateOtpTimer();
        byId("blockOtpCode").focus({preventScroll: true});
    }
    function showReviewStep() {
        byId("blockOtpStep").hidden = true;
        byId("blockReviewStep").hidden = false;
        byId("blockDetailDialog").setAttribute("aria-labelledby", "blockDialogTitle");
        byId("unblockSubmit").focus();
    }
    async function requestOtp() {
        if (!state.otp || state.otpBusy) return;
        const otp = state.otp;
        const resend = Boolean(otp.challengeId);
        state.otpBusy = true;
        byId("otpError").textContent = "";
        byId("otpDeliveryStatus").textContent = tr("otpSending");
        byId("otpDeliveryStatus").dataset.state = "sending";
        updateOtpTimer();
        try {
            await session();
            const path = resend ? "otp/resend" : "otp/start";
            const body = resend ? {challenge_id: otp.challengeId} : {
                confirm_ip: otp.ip, reason: otp.reason, expected_version: otp.version,
            };
            const result = await getJSON(`${api}/blocks/${encodeURIComponent(otp.ip)}/${path}`, {
                method: "POST", headers: {"Content-Type": "application/json", "X-CSRF-Token": state.session.csrf_token || ""},
                body: JSON.stringify(body),
            });
            if (state.otp !== otp) return;
            otp.challengeId = result.challenge_id;
            otp.expiresAt = Number(result.expires_at);
            otp.resendAt = Number(result.resend_at);
            otp.attemptsRemaining = 5;
            byId("otpDeliveryStatus").textContent = tr("otpSent");
            byId("otpDeliveryStatus").dataset.state = "sent";
            byId("blockOtpCode").focus();
        } catch (error) {
            if (state.otp !== otp) return;
            if (error.data?.resend_at) otp.resendAt = Number(error.data.resend_at);
            if (error.status === 503) {
                otp.challengeId = null;
                otp.expiresAt = 0;
                otp.resendAt = 0;
            }
            byId("otpDeliveryStatus").textContent = "";
            byId("otpDeliveryStatus").dataset.state = "error";
            byId("otpError").textContent = error.status === 429 ? tr("otpLimit")
                : error.status === 409 ? tr("otpStale") : tr("otpSendError");
        } finally {
            if (state.otp === otp) {
                state.otpBusy = false;
                updateOtpTimer();
            }
        }
    }
    async function submitUnblock() {
        const item = state.selected;
        const ip = byId("confirmBlockIp").value.trim();
        const reason = byId("unblockReason").value.trim();
        if (!item || ip !== item.ip || reason.length < 8 || reason.length > 500) {
            byId("unblockError").textContent = tr("invalid"); return;
        }
        byId("unblockError").textContent = "";
        state.otp = {ip, reason, version: item.version, challengeId: null, expiresAt: 0, resendAt: 0, attemptsRemaining: 5};
        showOtpStep();
        await requestOtp();
    }
    async function verifyOtp() {
        const otp = state.otp;
        const code = byId("blockOtpCode").value.trim();
        if (!otp) return;
        if (state.otpBusy || !beginAction("otp-unblock")) { waitLockedAction("otp-unblock"); return; }
        if (!/^[0-9]{6}$/.test(code)) {
            window.dashboardNotify?.actions?.release("otp-unblock");
            byId("otpError").textContent = tr("otpInvalid");
            byId("blockOtpCode").focus();
            return;
        }
        state.otpBusy = true;
        byId("otpError").textContent = "";
        byId("otpDeliveryStatus").textContent = tr("otpChecking");
        byId("otpDeliveryStatus").dataset.state = "sending";
        updateOtpTimer();
        try {
            await session();
            const action = await getJSON(`${api}/blocks/${encodeURIComponent(otp.ip)}/unblock`, {
                method: "POST", headers: {"Content-Type":"application/json", "X-CSRF-Token": state.session.csrf_token || ""},
                body: JSON.stringify({challenge_id: otp.challengeId, code, expected_version: otp.version}),
            });
            byId("blockDetailDialog").close();
            await loadList(true);
            const success = await waitAction(action.action_id);
            await loadList(true);
            finishAction("otp-unblock", success ? "success" : "error", success ? tr("done") : tr("errorTitle"), success ? tr("done") : tr("actionError"));
        } catch (error) {
            if (state.otp !== otp) { window.dashboardNotify?.actions?.release("otp-unblock"); return; }
            if (error.status === 422) {
                otp.attemptsRemaining = Number(error.data?.attempts_remaining ?? 0);
                byId("otpError").textContent = `${tr("otpWrong")} · ${fill("otpAttempts", {count: otp.attemptsRemaining})}`;
                finishAction("otp-unblock", "error", tr("errorTitle"), tr("otpWrong"));
                byId("blockOtpCode").value = "";
                byId("blockOtpCode").focus();
            } else {
                if (error.status === 410) otp.expiresAt = 0;
                byId("otpError").textContent = error.status === 410 ? tr("otpExpired")
                    : error.status === 409 ? tr("otpStale") : `${tr("actionError")}: ${error.message}`;
                finishAction("otp-unblock", "error", tr("errorTitle"), byId("otpError").textContent);
            }
            byId("otpDeliveryStatus").textContent = tr("otpSent");
            byId("otpDeliveryStatus").dataset.state = "sent";
        } finally {
            if (state.otp === otp) {
                state.otpBusy = false;
                updateOtpTimer();
            }
        }
    }
    byId("blockFilter").addEventListener("change", () => {state.cursor = 0; loadList();});
    byId("blockSort").addEventListener("change", () => {state.cursor = 0; loadList();});
    byId("blockPageSize").addEventListener("change", event => {
        state.limit = Number(event.target.value);
        state.cursor = 0;
        loadList();
    });
    byId("blockSearch").addEventListener("input", () => {
        clearTimeout(state.searchTimer);
        state.searchTimer = setTimeout(() => {state.cursor = 0; loadList();}, 300);
    });
    byId("blockRefresh").addEventListener("click", () => loadList(true, true));
    byId("blockPaginationButtons").addEventListener("click", event => {
        const button = event.target.closest("button[data-page-action], button[data-page]");
        if (!button || button.disabled) return;
        if (button.dataset.pageAction === "prev") state.cursor = Math.max(0, state.cursor - state.limit);
        else if (button.dataset.pageAction === "next") state.cursor += state.limit;
        else state.cursor = (Number(button.dataset.page) - 1) * state.limit;
        loadList();
    });
    byId("blockRows").addEventListener("click", event => {
        const button = event.target.closest("button[data-ip]");
        if (button) openDetail(button.dataset.ip);
    });
    byId("unblockSubmit").addEventListener("click", submitUnblock);
    byId("blockOtpCode").addEventListener("input", event => {
        event.target.value = event.target.value.replace(/\D/g, "").slice(0, 6);
        byId("otpError").textContent = "";
        updateOtpTimer();
    });
    byId("blockOtpCode").addEventListener("keydown", event => {
        if (event.key === "Enter") { event.preventDefault(); verifyOtp(); }
    });
    byId("otpConfirm").addEventListener("click", verifyOtp);
    byId("otpResend").addEventListener("click", requestOtp);
    byId("otpBack").addEventListener("click", showReviewStep);
    byId("blockDetailDialog").querySelector(".block-dialog-close").addEventListener("click", () => byId("blockDetailDialog").close());
    byId("blockDetailDialog").querySelector("form").addEventListener("submit", event => event.preventDefault());
    byId("blockDetailDialog").addEventListener("close", () => {
        clearInterval(state.otpTicker);
        state.otpTicker = null;
        state.otp = null;
        state.otpBusy = false;
        byId("blockOtpCode").value = "";
    });
    for (const id of ["thBtn", "enBtn"]) byId(id).addEventListener("click", () => setTimeout(() => {applyText(); loadList(true);}, 0));
    applyText();
    session();
    loadList();
    setInterval(() => {if (!document.hidden && !byId("blockDetailDialog").open) loadList(true);}, config.enforcementRefreshMs);
})();
