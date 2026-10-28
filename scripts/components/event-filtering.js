/* =========================
   EVENT FILTERING
========================= */

function getProcessedEvents() {
    const query =
        eventSearchQuery
            .trim()
            .toLocaleLowerCase();

    let events =
        eventSource;

    if (query) {
        events =
            events.filter(
                event =>
                    eventSearchText(event)
                        .includes(query)
            );
    }

    return sortEvents(events);
}
