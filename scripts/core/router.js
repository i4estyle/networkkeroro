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
        setTimeout(() => {
            if (chartTimelineInstance) chartTimelineInstance.resize();
            if (chartRadarInstance) chartRadarInstance.resize();
            if (chartDonutInstance) chartDonutInstance.resize();
            if (chartGaugeInstance) chartGaugeInstance.resize();
            if (chartPathsInstance) chartPathsInstance.resize();
        }, 80);
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
