/* Accessible top-center notifications shared by dashboard actions. */
(() => {
    "use strict";
    const active = new Map();
    const actionLocks = new Set();
    const dismissCallbacks = new WeakMap();

    function region() {
        let element = document.getElementById("dashboardToastRegion");
        if (element) return element;
        element = document.createElement("div");
        element.id = "dashboardToastRegion";
        element.className = "dashboard-toast-region";
        element.setAttribute("aria-label", "System notifications");
        document.body.appendChild(element);
        return element;
    }

    function icon(type) {
        const wrapper = document.createElement("span");
        wrapper.className = "dashboard-toast-icon";
        wrapper.setAttribute("aria-hidden", "true");
        wrapper.innerHTML = type === "error"
            ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 8v5"/><path d="M12 17h.01"/><path d="M10.3 3.7 2.5 17.2A2 2 0 0 0 4.2 20h15.6a2 2 0 0 0 1.7-2.8L13.7 3.7a2 2 0 0 0-3.4 0Z"/></svg>'
            : type === "info"
                ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5v5l3 1.8"/></svg>'
                : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.2 4.2L19 7"/></svg>';
        return wrapper;
    }

    function dismiss(element, key) {
        if (!element || element.dataset.leaving === "true") return;
        element.dataset.leaving = "true";
        element.classList.remove("is-visible");
        element.classList.add("is-leaving");
        window.setTimeout(() => {
            element.remove();
            const callback = dismissCallbacks.get(element);
            dismissCallbacks.delete(element);
            if (callback) callback();
        }, 260);
        if (key && active.get(key)?.element === element) active.delete(key);
    }

    function show({type = "success", title = "", message = "", key = "", duration, onDismiss} = {}) {
        const normalizedType = ["error", "info"].includes(type) ? type : "success";
        const timeout = Number.isFinite(duration) ? duration : (normalizedType === "error" ? 5600 : 3800);
        if (key && active.has(key)) {
            const previous = active.get(key);
            window.clearTimeout(previous.timer);
            dismiss(previous.element, key);
        }

        const toast = document.createElement("section");
        toast.className = `dashboard-toast dashboard-toast--${normalizedType}`;
        toast.setAttribute("role", normalizedType === "error" ? "alert" : "status");
        toast.setAttribute("aria-live", normalizedType === "error" ? "assertive" : "polite");
        toast.setAttribute("aria-atomic", "true");
        const durationClass = timeout <= 2200
            ? "dashboard-toast--duration-short"
            : (timeout >= 5600 ? "dashboard-toast--duration-long" : "dashboard-toast--duration-standard");
        toast.classList.add(durationClass);
        if (typeof onDismiss === "function") dismissCallbacks.set(toast, onDismiss);
        toast.appendChild(icon(normalizedType));

        const content = document.createElement("div");
        content.className = "dashboard-toast-content";
        const heading = document.createElement("strong");
        heading.textContent = title || (normalizedType === "error" ? "ไม่สำเร็จ" : "สำเร็จ");
        const detail = document.createElement("span");
        detail.textContent = String(message || "");
        content.append(heading, detail);
        toast.appendChild(content);

        const close = document.createElement("button");
        close.className = "dashboard-toast-close";
        close.type = "button";
        close.setAttribute("aria-label", "ปิดการแจ้งเตือน");
        close.textContent = "×";
        close.addEventListener("click", () => dismiss(toast, key));
        toast.appendChild(close);

        const progress = document.createElement("span");
        progress.className = "dashboard-toast-progress";
        progress.setAttribute("aria-hidden", "true");
        toast.appendChild(progress);
        region().prepend(toast);
        requestAnimationFrame(() => toast.classList.add("is-visible"));

        const timer = window.setTimeout(() => dismiss(toast, key), timeout);
        if (key) active.set(key, {element: toast, timer});
        return () => {
            window.clearTimeout(timer);
            dismiss(toast, key);
        };
    }

    function setButtonBusy(button, busy) {
        if (!button) return;
        button.classList.toggle("ui-action-busy", Boolean(busy));
        button.setAttribute("aria-busy", String(Boolean(busy)));
        button.setAttribute("aria-disabled", String(Boolean(busy)));
    }

    const actions = Object.freeze({
        begin(key) {
            if (!key || actionLocks.has(key)) return false;
            actionLocks.add(key);
            return true;
        },
        finish(key, options = {}) {
            return show({...options, key, onDismiss: () => actionLocks.delete(key)});
        },
        wait(key, options = {}) {
            return show({type: "info", duration: 2200, ...options, key: `${key || "action"}-wait`});
        },
        release(key) { actionLocks.delete(key); },
        isLocked(key) { return actionLocks.has(key); },
    });

    window.dashboardNotify = Object.freeze({show, actions});
    window.dashboardButtonBusy = setButtonBusy;
})();
