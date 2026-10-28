/* =========================
   EVENT TABLE
========================= */

function renderEventTable() {
    const processed =
        getProcessedEvents();

    const totalItems =
        processed.length;

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                totalItems /
                eventPageSize
            )
        );

    if (
        eventCurrentPage >
        totalPages
    ) {
        eventCurrentPage =
            totalPages;
    }

    if (
        eventCurrentPage < 1
    ) {
        eventCurrentPage = 1;
    }

    const startIndex =
        (eventCurrentPage - 1) *
        eventPageSize;

    const endIndex =
        Math.min(
            startIndex +
            eventPageSize,
            totalItems
        );

    const pageItems =
        processed.slice(
            startIndex,
            endIndex
        );

    if (!totalItems) {
        const query = eventSearchQuery.trim();
        const isKnownTrafficIp = query &&
            ipSource.some(item =>
                Array.isArray(item) &&
                String(item[0]) === query
            );

        $("eventList").innerHTML =
            `<div class="empty">${
                safe(
                    eventSearchQuery.trim()
                        ? isKnownTrafficIp
                            ? t("noSecurityEventForIp")
                            : t("noSearchResults")
                        : t("noEvents")
                )
            }</div>`;

        renderPagination(
            0,
            0,
            0,
            1
        );

        return;
    }

    $("eventList").innerHTML =
        pageItems
            .map(event => `
                <div class="event-row">

                    <div data-label="${safe(t("time"))}">
                        ${safe(formatDateTime(event.time || event.minute))}
                    </div>

                    <div data-label="IP">
                        ${safe(event.ip)}
                    </div>

                    <div data-label="${safe(t("requests"))}">
                        ${safe(event.total_requests)}
                    </div>

                    <div data-label="${safe(t("detection"))}">
                        ${safe(detectionText(event))}
                    </div>

                    <div data-label="${safe(t("severity"))}">
                        ${severity(event.severity)}
                    </div>

                </div>
            `)
            .join("");

    renderPagination(
        startIndex + 1,
        endIndex,
        totalItems,
        totalPages
    );
}
