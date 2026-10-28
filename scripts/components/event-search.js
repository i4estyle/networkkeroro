/* =========================
   EVENT SEARCH
========================= */

function eventSearchText(event) {
    const severityValue =
        String(
            event.severity || "LOW"
        );

    const aiText =
        event.ai_anomaly
            ? t("detected")
            : t("notDetected");

    const values = [
        event.minute,
        formatDateTime(event.minute),
        event.ip,
        event.total_requests,
        detectionText(event),
        aiText,
        severityValue,
        t(severityValue)
    ];

    return values
        .map(
            value =>
                String(value ?? "")
                    .toLocaleLowerCase()
        )
        .join(" ");
}
