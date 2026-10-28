/* =========================
   EVENTS
========================= */

$("thBtn").addEventListener(
    "click",
    () =>
        setLanguage("th")
);

$("enBtn").addEventListener(
    "click",
    () =>
        setLanguage("en")
);

$("eventSearch").addEventListener(
    "input",
    event => {

        eventSearchQuery =
            event.target.value;

        eventCurrentPage = 1;

        $("searchClear")
            .classList
            .toggle(
                "show",
                Boolean(
                    eventSearchQuery
                        .trim()
                )
            );

        renderEventTable();
    }
);

$("searchClear").addEventListener(
    "click",
    () => {

        eventSearchQuery = "";

        $("eventSearch").value =
            "";

        $("searchClear")
            .classList
            .remove("show");

        eventCurrentPage = 1;

        renderEventTable();

        $("eventSearch").focus();
    }
);

$("eventSort").addEventListener(
    "change",
    event => {

        eventSortMode =
            event.target.value;

        eventCurrentPage = 1;

        renderEventTable();
    }
);

$("eventPageSize").addEventListener(
    "change",
    event => {

        const parsed =
            Number(
                event.target.value
            );

        eventPageSize =
            Number.isFinite(parsed) &&
            parsed > 0
                ? parsed
                : 10;

        eventCurrentPage = 1;

        renderEventTable();
    }
);

$("homeIpSort")?.addEventListener("change", event => {
    ipSortMode = event.target.value;
    if ($("historyIpSort")) $("historyIpSort").value = ipSortMode;
    renderIPs();
});

$("historyIpSort")?.addEventListener("change", event => {
    ipSortMode = event.target.value;
    if ($("homeIpSort")) $("homeIpSort").value = ipSortMode;
    renderIPs();
});

$("paginationButtons").addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                "button"
            );

        if (
            !button ||
            button.disabled
        ) {
            return;
        }

        const processed =
            getProcessedEvents();

        const totalPages =
            Math.max(
                1,
                Math.ceil(
                    processed.length /
                    eventPageSize
                )
            );

        const action =
            button.dataset.pageAction;

        const page =
            Number(
                button.dataset.page
            );

        if (
            action === "prev"
        ) {
            eventCurrentPage =
                Math.max(
                    1,
                    eventCurrentPage - 1
                );
        } else if (
            action === "next"
        ) {
            eventCurrentPage =
                Math.min(
                    totalPages,
                    eventCurrentPage + 1
                );
        } else if (
            Number.isFinite(page) &&
            page >= 1 &&
            page <= totalPages
        ) {
            eventCurrentPage =
                page;
        }

        renderEventTable();
    }
);
