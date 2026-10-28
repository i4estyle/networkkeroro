/* =========================
   START
========================= */

async function start() {
    applyLanguage();

    try {
        await loadDashboard();
    } catch (e) {
        console.error("loadDashboard error in start():", e);
    } finally {
        setTimeout(() => {
            const loaderEl = $("loader");
            if (loaderEl) loaderEl.classList.add("hide");
            const appEl = $("app");
            if (appEl) appEl.classList.add("show");
        }, 200);
    }
}

start();

    // Ensure all dialogs are properly closed on initial load
    try {
        const bd = document.getElementById("blockDetailDialog");
        if (bd && bd.open) bd.close();
        const ed = document.getElementById("eventLabelDialog");
        if (ed && ed.open) ed.close();
    } catch (e) {}


/* =========================
   NEAR REALTIME
========================= */

setInterval(
    () => {

        if (!document.hidden) {
            loadDashboard();
        }

    },
    window.KeroroDashboardConfig.dashboardRefreshMs
);
