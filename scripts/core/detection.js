/* =========================
   DETECTION
========================= */

function cleanThaiText(text) {
    if (!text) return "";
    return String(text).replace(/\s*\([A-Za-z0-9_,\s\-\.\/]+\)/g, "").trim();
}

function detectionText(event) {
    const reasons = Array.isArray(event.reasons) ? event.reasons : [];
    const reasonLabels = reasons.map(r => t(r) || r).filter(Boolean);
    const baseText = reasonLabels.join(", ");

    if (language === "th") {
        if (event.reason_th) {
            const cleanedTh = cleanThaiText(event.reason_th);
            return baseText ? `${baseText} • ${cleanedTh}` : cleanedTh;
        }
        if (event.evidence && Array.isArray(event.evidence) && event.evidence.length > 0) {
            return `${baseText} • ${cleanThaiText(event.evidence[0])}`;
        }
        if (!reasons.length && event.ai_anomaly) {
            return t("AI_ANOMALY");
        }
        return baseText || t("LOW_RISK_PATTERN");
    } else {
        if (event.evidence && Array.isArray(event.evidence) && event.evidence.length > 0) {
            return baseText ? `${baseText} • ${event.evidence[0]}` : event.evidence[0];
        }
        if (!reasons.length && event.ai_anomaly) {
            return t("AI_ANOMALY");
        }
        return baseText || t("LOW_RISK_PATTERN");
    }
}

function severity(level) {
    const value =
        String(
            level || "LOW"
        );

    return `
        <span class="badge ${safe(value.toLowerCase())}">
            ${safe(t(value))}
        </span>
    `;
}

function severityWeight(level) {
    switch (
        String(level || "LOW")
            .toUpperCase()
    ) {
        case "HIGH":
            return 3;

        case "MEDIUM":
            return 2;

        default:
            return 1;
    }
}
