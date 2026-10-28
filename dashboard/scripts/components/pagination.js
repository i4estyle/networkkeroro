/* =========================
   PAGINATION
========================= */

function paginationSummaryText(
    start,
    end,
    total
) {
    if (!total) {
        return language === "th"
            ? "แสดง 0 รายการ"
            : "Showing 0 results";
    }

    return language === "th"
        ? `แสดง ${start}–${end} จาก ${total} รายการ`
        : `Showing ${start}–${end} of ${total} results`;
}

function getPageNumbers(
    current,
    total
) {
    if (total <= 7) {
        return Array.from(
            {
                length: total
            },
            (_, index) =>
                index + 1
        );
    }

    const pages = [1];

    const start =
        Math.max(
            2,
            current - 1
        );

    const end =
        Math.min(
            total - 1,
            current + 1
        );

    if (start > 2) {
        pages.push("...");
    }

    for (
        let page = start;
        page <= end;
        page++
    ) {
        pages.push(page);
    }

    if (
        end <
        total - 1
    ) {
        pages.push("...");
    }

    pages.push(total);

    return pages;
}

function renderPagination(
    start,
    end,
    total,
    totalPages
) {
    $("paginationSummary").textContent =
        paginationSummaryText(
            start,
            end,
            total
        );

    if (!total) {
        $("paginationButtons").innerHTML =
            "";

        return;
    }

    const pages =
        getPageNumbers(
            eventCurrentPage,
            totalPages
        );

    let html = `
        <button
            class="page-btn"
            type="button"
            data-page-action="prev"
            ${
                eventCurrentPage === 1
                    ? "disabled"
                    : ""
            }
        >
            ${safe(t("previous"))}
        </button>
    `;

    pages.forEach(page => {

        if (page === "...") {
            html += `
                <span class="page-ellipsis">
                    …
                </span>
            `;

            return;
        }

        html += `
            <button
                class="page-btn ${
                    page === eventCurrentPage
                        ? "active"
                        : ""
                }"
                type="button"
                data-page="${page}"
                ${
                    page === eventCurrentPage
                        ? 'aria-current="page"'
                        : ""
                }
            >
                ${page}
            </button>
        `;
    });

    html += `
        <button
            class="page-btn"
            type="button"
            data-page-action="next"
            ${
                eventCurrentPage === totalPages
                    ? "disabled"
                    : ""
            }
        >
            ${safe(t("next"))}
        </button>
    `;

    $("paginationButtons").innerHTML =
        html;
}
