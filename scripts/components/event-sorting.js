/* =========================
   EVENT SORTING
========================= */

function getEventTime(e) {
    return eventTimestamp(e.time || e.minute);
}

function sortEvents(events) {
    const sorted = [...events];

    switch (eventSortMode) {
        case "oldest":
            sorted.sort((a, b) => getEventTime(a) - getEventTime(b));
            break;

        case "requests-desc":
            sorted.sort(
                (a, b) =>
                    Number(b.total_requests || 0) -
                    Number(a.total_requests || 0) ||
                    getEventTime(b) -
                    getEventTime(a)
            );
            break;

        case "requests-asc":
            sorted.sort(
                (a, b) =>
                    Number(a.total_requests || 0) -
                    Number(b.total_requests || 0) ||
                    getEventTime(b) -
                    getEventTime(a)
            );
            break;

        case "severity":
            sorted.sort(
                (a, b) =>
                    severityWeight(b.severity) -
                    severityWeight(a.severity) ||
                    getEventTime(b) -
                    getEventTime(a)
            );
            break;

        case "ip":
            sorted.sort(
                (a, b) =>
                    compareIp(a.ip || "", b.ip || "") ||
                    getEventTime(b) -
                    getEventTime(a)
            );
            break;

        case "newest":
        default:
            sorted.sort((a, b) => getEventTime(b) - getEventTime(a));
            break;
    }

    return sorted;
}
