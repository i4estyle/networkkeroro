/* =========================
   DASHBOARD NAVIGATION
========================= */

const dashboardViews = new Set(["home", "blocks", "history"]);

function getDashboardView() {
    const requested = window.location.hash.replace("#", "");

    return dashboardViews.has(requested)
        ? requested
        : "home";
}

function setDashboardView(view, updateUrl = false) {
    if (view === "home") {
        const resizeCharts = () => {
            if (typeof chartTimelineInstance !== "undefined" && chartTimelineInstance) chartTimelineInstance.resize();
            if (typeof chartRadarInstance !== "undefined" && chartRadarInstance) chartRadarInstance.resize();
            if (typeof chartDonutInstance !== "undefined" && chartDonutInstance) chartDonutInstance.resize();
            if (typeof chartGaugeInstance !== "undefined" && chartGaugeInstance) chartGaugeInstance.resize();
            if (typeof chartPathsInstance !== "undefined" && chartPathsInstance) chartPathsInstance.resize();
        };
        setTimeout(resizeCharts, 80);
        setTimeout(resizeCharts, 450);
    }
    const activeView = dashboardViews.has(view)
        ? view
        : "home";

    document
        .querySelectorAll("[data-dashboard-view]")
        .forEach(element => {
            element.classList.toggle(
                "is-active",
                element.dataset.dashboardView === activeView
            );
        });

    document
        .querySelectorAll("[data-dashboard-nav]")
        .forEach(button => {
            const isActive =
                button.dataset.dashboardNav === activeView;

            button.classList.toggle("is-active", isActive);

            if (isActive) {
                button.setAttribute("aria-current", "page");
            } else {
                button.removeAttribute("aria-current");
            }
        });

    if (updateUrl && window.location.hash !== `#${activeView}`) {
        window.location.hash = activeView;
    }
}

document
    .querySelectorAll("[data-dashboard-nav]")
    .forEach(button => {
        button.addEventListener("click", () => {
            setDashboardView(button.dataset.dashboardNav, true);
        });
    });

window.addEventListener("hashchange", () => {
    setDashboardView(getDashboardView());
});

setDashboardView(getDashboardView());
