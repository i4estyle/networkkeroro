/* =========================
   DATE / TIME
========================= */

function normalizeEventDate(value) {
    if (!value) {
        return null;
    }

    let normalized =
        String(value).trim();

    if (
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/
            .test(normalized)
    ) {
        normalized += ":00Z";
    }

    const date =
        new Date(normalized);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return null;
    }

    return date;
}

function eventTimestamp(value) {
    const date =
        normalizeEventDate(value);

    return date
        ? date.getTime()
        : 0;
}

function formatDateTime(value) {
    const date =
        normalizeEventDate(value);

    if (!date) {
        return value || "-";
    }

    const locale =
        language === "th"
            ? "th-TH-u-ca-buddhist"
            : "en-GB-u-ca-gregory";

    const parts =
        new Intl.DateTimeFormat(
            locale,
            {
                timeZone: "Asia/Bangkok",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false
            }
        ).formatToParts(date);

    const getPart =
        type =>
            parts.find(
                part =>
                    part.type === type
            )?.value || "";

    return (
        `${getPart("day")}/` +
        `${getPart("month")}/` +
        `${getPart("year")} ` +
        `${getPart("hour")}:` +
        `${getPart("minute")}:` +
        `${getPart("second")}`
    );
}
