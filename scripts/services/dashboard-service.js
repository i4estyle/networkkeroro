/* =========================
   DASHBOARD FETCH
========================= */

async function loadDashboard() {
    if (isLoading) {
        return;
    }

    isLoading = true;

    try {
        const response =
            await fetch(
                `${window.KeroroDashboardConfig.analysisUrl}?t=${Date.now()}`,
                {
                    cache: "no-store"
                }
            );

        if (!response.ok) {
            throw new Error(
                `HTTP ${response.status}`
            );
        }

        const data =
            await response.json();

        if (
            !data ||
            typeof data !== "object"
        ) {
            throw new Error(
                "Invalid analysis data"
            );
        }

        render(data);

    } catch (error) {

        console.error(
            "Dashboard update failed:",
            error
        );

    } finally {

        isLoading = false;

    }
}
