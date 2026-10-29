/* Source: scripts/config/dashboard-config.js */
/* Shared runtime configuration for every dashboard feature. */
window.KeroroDashboardConfig = Object.freeze({
    apiBase: "/security-dashboard/api/v1",
    analysisUrl: "analysis.json",
    blocksSummaryUrl: "blocks_summary.json",
    dashboardRefreshMs: 5000,
    enforcementRefreshMs: 5000,
});

/* Source: scripts/core/http-compat.js */
(function() {
    function xhrFetch(url, options) {
        return new Promise(function(resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open((options && options.method) || "GET", url, true);
            xhr.withCredentials = true;
            if (options && options.headers) {
                var h = options.headers;
                if (h.forEach) {
                    h.forEach(function(val, key) { xhr.setRequestHeader(key, val); });
                } else {
                    for (var k in h) {
                        if (Object.prototype.hasOwnProperty.call(h, k)) xhr.setRequestHeader(k, h[k]);
                    }
                }
            }
            xhr.onload = function() {
                resolve({
                    ok: xhr.status >= 200 && xhr.status < 300,
                    status: xhr.status,
                    statusText: xhr.statusText,
                    json: function() { return Promise.resolve(JSON.parse(xhr.responseText)); },
                    text: function() { return Promise.resolve(xhr.responseText); }
                });
            };
            xhr.onerror = function() {
                reject(new TypeError("XHR request failed"));
            };
            xhr.send((options && options.body) || null);
        });
    }

    var origFetch = window.fetch;
    window.fetch = function(input, init) {
        if (window.location.href.indexOf('@') !== -1) {
            var urlStr = typeof input === 'string' ? input : (input && input.url ? input.url : '');
            return xhrFetch(urlStr, init);
        }
        try {
            return origFetch(input, init).catch(function(err) {
                if (err && (err.name === 'TypeError' || String(err).indexOf('credentials') !== -1)) {
                    var fallbackUrl = typeof input === 'string' ? input : (input && input.url ? input.url : '');
                    return xhrFetch(fallbackUrl, init);
                }
                return Promise.reject(err);
            });
        } catch (syncErr) {
            var fallbackUrl = typeof input === 'string' ? input : (input && input.url ? input.url : '');
            return xhrFetch(fallbackUrl, init);
        }
    };
})();

/* Source: scripts/core/dom.js */
const $ = id => document.getElementById(id);

/* Source: scripts/i18n/translations.js */
const i18n = {
    th: {
        loadingTitle: "กำลังเตรียมแดชบอร์ด",
        loadingSubtitle: "กำลังโหลดข้อมูลความปลอดภัยล่าสุด",

        title: "ระบบความปลอดภัย",
        subtitle: "คณะวิทยาการสารสนเทศ มหาวิทยาลัยบูรพา • ระบบตรวจสอบความปลอดภัย Keroro Network",

        navHome: "หน้าหลัก",
        navBlocks: "จัดการ IP ที่บล็อก",
        navHistory: "ค้นหาประวัติเหตุการณ์",

        chartsTitle: "ภาพรวมและแนวโน้มความปลอดภัย",
        chartsSubtitle: "สรุปปริมาณคำขอ เหตุการณ์ความเสี่ยง และเป้าหมายที่ถูกตรวจพบตามช่วงเวลา",
        chartTimelineTitle: "แนวโน้มปริมาณคำขอและภัยคุกคาม",
        chartTimelineDesc: "เปรียบเทียบคำขอทั้งหมดและเหตุการณ์ภัยคุกคามตามช่วงเวลาที่เลือก",
        legendNormal: "คำขอทั้งหมด",
        legendThreat: "เหตุการณ์ภัยคุกคาม",
        periodLabel: "ช่วงเวลา",
        periodToday: "วันนี้ · รายชั่วโมง",
        periodMonth: "เดือนนี้ · รายวัน",
        periodQuarter: "ไตรมาสนี้ · รายสัปดาห์",
        periodYear: "ปีนี้ · รายเดือน",
        periodTodayShort: "วันนี้",
        periodMonthShort: "เดือนนี้",
        periodQuarterShort: "ไตรมาสนี้",
        periodYearShort: "ปีนี้",
        chartGaugeTitle: "ระดับความปลอดภัยระบบ",
        chartGaugeDesc: "ดัชนีชี้วัดความมั่นคงปลอดภัยจากคำขอและภัยคุกคามที่ตรวจพบ",
        chartRadarTitle: "เรดาร์มิติภัยคุกคาม 6 ด้าน",
        chartRadarDesc: "วิเคราะห์ความเสี่ยงรายประเภทตามพฤติกรรมของ Hacker",
        chartDonutTitle: "สัดส่วนระดับความเสี่ยง",
        chartDonutDesc: "อัตราส่วนระหว่างความเสี่ยงสูง ปานกลาง และต่ำ",
        chartPathsTitle: "เป้าหมายที่ถูกโจมตีบ่อยที่สุด",
        chartPathsDesc: "เส้นทาง URL ที่ถูกโจมตีหรือสแกนหาช่องโหว่สูงสุด",
        heroTitle: "แดชบอร์ดภาพรวมความปลอดภัย",
        heroText: "ติดตามการเข้าถึงเว็บไซต์ เหตุการณ์ความเสี่ยง และสถานะการป้องกันจากข้อมูลล่าสุด",

        monitoring: "ระบบกำลังทำงาน",

        requests: "คำขอทั้งหมด",
        requestsNote: "คำขอที่บันทึกไว้ตั้งแต่เริ่มเก็บข้อมูล",

        uniqueIps: "IP ที่ไม่ซ้ำ",
        uniqueIpsNote: "จำนวน IP ที่เข้าถึงเว็บไซต์",

        events: "เหตุการณ์ความปลอดภัย",
        eventsNote: "เหตุการณ์ที่ระบบตรวจพบ",

        anomalies: "ความผิดปกติจาก AI",
        anomaliesNote: "ตรวจจับด้วย Google Gemini AI",

        high: "ความเสี่ยงสูง",
        highNote: "เหตุการณ์ระดับความเสี่ยงสูง",

        aiStatus: "สถานะ AI",

        topIps: "IP ที่มีการเข้าถึง",
        topIpsCount: "{count} IP",

        timelineDay: "วัน (24 ชม.)",
        timelineMonth: "เดือน (30 วัน)",
        timelineQuarter: "ไตรมาส (90 วัน)",
        timelineYear: "ปี (12 เดือน)",

        sortMost: "มากสุด",
        sortLeast: "น้อยสุด",

        ipAddress: "หมายเลข IP",
        requestCount: "จำนวนคำขอ",

        recentEvents: "เหตุการณ์ความปลอดภัยล่าสุด",
        recentEventsSub: "เหตุการณ์ที่ตรวจพบล่าสุด",

        time: "เวลา",
        detection: "สาเหตุที่ตรวจพบ",
        severity: "ระดับความเสี่ยง",

        active: "กำลังทำงาน",
        waiting: "รอข้อมูล",
        BASELINE_COLLECTING: "AI กำลังเรียนรู้พฤติกรรมปกติ",
        VALIDATION_REQUIRED: "รอตรวจสอบโมเดล",
        DEGRADED: "โมเดลมีปัญหา",
        APPROVED: "โมเดลผ่านการรับรอง",

        aiCollectingDetail: "ใช้ Google Gemini AI ในการตรวจสอบ Log",
        aiReadyDetail: "ใช้ Google Gemini AI ในการตรวจสอบ Log",
        aiAttentionDetail: "ใช้ Google Gemini AI ในการตรวจสอบ Log",

        noData: "ยังไม่มีข้อมูล",
        noEvents: "ไม่พบเหตุการณ์ความปลอดภัยในช่วงเวลานี้",
        noSearchResults: "ไม่พบข้อมูลที่ตรงกับคำค้นหา",
        noSecurityEventForIp: "พบ IP นี้ในข้อมูลการเข้าถึง แต่ยังไม่พบเหตุการณ์ความปลอดภัยในรายการล่าสุด",

        detected: "ตรวจพบ",
        notDetected: "ไม่พบ",

        HIGH: "สูง",
        MEDIUM: "ปานกลาง",
        LOW: "ต่ำ",

        SUSTAINED_BRUTE_FORCE: "โจมตีระบบล็อกอินอย่างต่อเนื่อง",
        RATE_LIMIT: "ส่งคำขอเกินกำหนด",
        ACCESS_DENIED_BURST: "พยายามเข้าถึงถูกปฏิเสธหลายครั้ง",
        PATH_SCANNING: "ตรวจพบการสแกนเส้นทางระบบ",
        LOGIN_BRUTE_FORCE: "พยายามเข้าสู่ระบบถี่ผิดปกติ",
        HIGH_REQUEST_RATE: "มีคำขอจำนวนมากผิดปกติ",
        SUSPICIOUS_PATH: "เข้าถึงเส้นทางที่น่าสงสัย",
        AI_ANOMALY: "AI ตรวจพบพฤติกรรมผิดปกติ",
        LOW_RISK_PATTERN: "รูปแบบคำขอความเสี่ยงต่ำ",
        SQL_INJECTION: "แทรกแซงคำสั่ง SQL",
        XSS_ATTACK: "โจมตีด้วย Cross-Site Scripting",
        COMMAND_INJECTION: "แทรกแซงคำสั่งระบบ",
        DIRECTORY_TRAVERSAL: "เข้าถึงไฟล์ระบบนอกขอบเขต",
        SENSITIVE_FILE_ACCESS: "พยายามเข้าถึงไฟล์ข้อมูลสำคัญ",
        SUSPICIOUS_PROBING: "สแกนค้นหาช่องโหว่เว็บไซต์",

        searchPlaceholder: "ค้นหาเวลา, IP, สาเหตุ, AI, ระดับความเสี่ยง...",

        sortBy: "เรียงตาม",
        sortMost: " คำขอ: มากที่สุด → น้อยที่สุด",
        sortLeast: " คำขอ: น้อยที่สุด → มากที่สุด",
        sortNewest: " เวลา: ล่าสุดก่อน",
        sortOldest: " เวลา: เก่าสุดก่อน",
        sortRequestsDesc: " ปริมาณคำขอ: มากที่สุด → น้อยที่สุด",
        sortRequestsAsc: " ปริมาณคำขอ: น้อยที่สุด → มากที่สุด",
        sortSeverity: " ระดับความเสี่ยง: รุนแรงที่สุดก่อน",
        sortIp: " หมายเลข IP (เรียงตามไอพี)",
        sortBlockNewest: " เวลาถูกบล็อก: ล่าสุดก่อน",
        sortBlockOldest: " เวลาถูกบล็อก: เก่าสุดก่อน",
        sortBlockStatus: " สถานะ: บล็อกถาวรก่อน",
        timelineDay: " วันนี้ (24 ชม. · ช่วงละ 2 ชม.)",
        timelineMonth: " 30 วันล่าสุด (รายวัน)",
        timelineQuarter: " ไตรมาส (90 วัน · รายสัปดาห์)",
        timelineYear: " รอบปี (12 เดือน · รายเดือน)",

        rowsPerPage: "แสดงต่อหน้า",

        previous: "ก่อนหน้า",
        next: "ถัดไป",

        footerSystemTitle: "Keroro Network Security Dashboard",

        footerSystemDesc:
            "ระบบติดตามและวิเคราะห์ความปลอดภัยของเว็บไซต์ WordPress สำหรับโครงการ Network Project โดยตรวจสอบ Log และแสดงผลผ่าน Security Dashboard",

        footerProjectTitle: "ข้อมูลโครงการ",

        footerProjectItem1:
            "เว็บไซต์ WordPress ทำงานบน Azure Cloud VPS",

        footerProjectItem2:
            "ป้องกันการเข้าถึงด้วย Firewall และ Thailand IP Set",

        footerProjectItem3:
            "ตรวจสอบ Nginx Log และวิเคราะห์เหตุการณ์ความปลอดภัย",

        footerProjectItem4:
            "แสดงผลข้อมูลและสถานะผ่าน Dashboard แบบกึ่ง Realtime",

        footerTechTitle: "เทคโนโลยีที่ใช้",

        footerStatusTitle: "สถานะระบบ",

        footerStatusText:
            "ระบบกำลังทำงาน",

        footerStatusDesc2:
            "วิเคราะห์ด้วย Hybrid Rules และ Google Gemini AI",

        footerBottomLine1:
            "โครงการนี้จัดทำขึ้นเพื่อการศึกษาและการนำเสนอในรายวิชา Network Project",

        footerBottomLine2:
            "Faculty of Informatics, Burapha University"
    },

    en: {
        loadingTitle: "Preparing Dashboard",
        loadingSubtitle: "Loading latest security data",

        title: "Security Monitoring",
        subtitle: "Faculty of Informatics, Burapha University • Keroro Network Security Monitoring",

        navHome: "Overview",
        navBlocks: "Blocked IPs",
        navHistory: "Event History",

        chartsTitle: "Security Trends Overview",
        chartsSubtitle: "Summary of request volume, risk events, and detected targets over time",
        chartTimelineTitle: "Traffic & Threat Dynamics",
        chartTimelineDesc: "Compare total requests and detected threats across the selected period",
        legendNormal: "Total Requests",
        legendThreat: "Threat Events",
        periodLabel: "Period",
        periodToday: "Today · hourly",
        periodMonth: "This month · daily",
        periodQuarter: "This quarter · weekly",
        periodYear: "This year · monthly",
        periodTodayShort: "Today",
        periodMonthShort: "This month",
        periodQuarterShort: "This quarter",
        periodYearShort: "This year",
        chartGaugeTitle: "System Security Level",
        chartGaugeDesc: "Security index derived from requests and detected malicious activity",
        chartRadarTitle: "Threat Vector Radar",
        chartRadarDesc: "Multi-dimensional risk analysis by attacker tactics",
        chartDonutTitle: "Risk Severity Breakdown",
        chartDonutDesc: "Ratio of High, Medium, and Low risk events",
        chartPathsTitle: "Top Targeted Endpoints",
        chartPathsDesc: "Most targeted endpoints and probed vulnerability URLs",
        heroTitle: "Security Overview Dashboard",
        heroText: "Monitor website access, risk events, and protection status using the latest available data",

        monitoring: "System Active",

        requests: "Total Requests",
        requestsNote: "Requests retained since logging began",

        uniqueIps: "Unique IPs",
        uniqueIpsNote: "Unique IP addresses accessing the website",

        events: "Security Events",
        eventsNote: "Detected security events",

        anomalies: "AI Anomalies",
        anomaliesNote: "Detected by Google Gemini AI",

        high: "High Severity",
        highNote: "High-risk security events",

        aiStatus: "AI Status",

        topIps: "Accessed IPs",
        topIpsCount: "{count} IPs",

        timelineDay: "Day (24h)",
        timelineMonth: "Month (30d)",
        timelineQuarter: "Quarter (90d)",
        timelineYear: "Year (12m)",

        sortMost: "Most requests",
        sortLeast: "Least requests",

        ipAddress: "IP Address",
        requestCount: "Requests",

        recentEvents: "Recent Security Events",
        recentEventsSub: "Latest detected events",

        time: "Date / Time",
        detection: "Detection",
        severity: "Severity",

        active: "ACTIVE",
        waiting: "WAITING",
        BASELINE_COLLECTING: "AI IS LEARNING NORMAL BEHAVIOUR",
        VALIDATION_REQUIRED: "VALIDATION REQUIRED",
        DEGRADED: "MODEL DEGRADED",
        APPROVED: "MODEL APPROVED",

        aiCollectingDetail: "Using Google Gemini AI to analyze logs",
        aiReadyDetail: "Using Google Gemini AI to analyze logs",
        aiAttentionDetail: "Using Google Gemini AI to analyze logs",

        noData: "No data available",
        noEvents: "No security events detected",
        noSearchResults: "No results match your search",
        noSecurityEventForIp: "This IP has traffic activity, but no security event in the latest list",

        detected: "Detected",
        notDetected: "None",

        HIGH: "HIGH",
        MEDIUM: "MEDIUM",
        LOW: "LOW",

        RATE_LIMIT: "Rate limit exceeded",
        ACCESS_DENIED_BURST: "Access denied burst",
        PATH_SCANNING: "Path scanning",
        LOGIN_BRUTE_FORCE: "Login brute force",
        HIGH_REQUEST_RATE: "High request rate",
        SUSPICIOUS_PATH: "Suspicious path",
        AI_ANOMALY: "AI anomaly",
        LOW_RISK_PATTERN: "Low-risk request pattern",

        searchPlaceholder: "Search time, IP, detection, AI, severity...",

        sortBy: "Sort by",
        sortMost: " Requests: High → Low",
        sortLeast: " Requests: Low → High",
        sortNewest: " Time: Newest first",
        sortOldest: " Time: Oldest first",
        sortRequestsDesc: " Requests: High → Low",
        sortRequestsAsc: " Requests: Low → High",
        sortSeverity: " Severity: Highest first",
        sortIp: " IP Address (A → Z)",
        sortBlockNewest: " Blocked: Newest first",
        sortBlockOldest: " Blocked: Oldest first",
        sortBlockStatus: " Status: Permanent first",
        timelineDay: " Today (24h · 2h buckets)",
        timelineMonth: " Last 30 Days (Daily)",
        timelineQuarter: " Quarter (90 Days · Weekly)",
        timelineYear: " Year (12 Months · Monthly)",

        rowsPerPage: "Rows",

        previous: "Previous",
        next: "Next",

        footerSystemTitle: "Keroro Network Security Dashboard",

        footerSystemDesc:
            "A WordPress security monitoring and analysis system developed for the Network Project, providing log inspection and security dashboard visualization",

        footerProjectTitle: "Project Information",

        footerProjectItem1:
            "WordPress website deployed on Azure Cloud VPS",

        footerProjectItem2:
            "Protected with Firewall and Thailand IP Set rules",

        footerProjectItem3:
            "Nginx log monitoring and security event analysis",

        footerProjectItem4:
            "Semi-realtime security dashboard visualization",

        footerTechTitle: "Technologies",

        footerStatusTitle: "System Status",

        footerStatusText:
            "System Active",

        footerStatusDesc2:
            "Analyzed with Hybrid Rules and Google Gemini AI",

        footerBottomLine1:
            "This project was developed for educational and presentation purposes in the Network Project course",

        footerBottomLine2:
            "Faculty of Informatics, Burapha University"
    }
};

/* Source: scripts/core/state.js */
let language =
    localStorage.getItem("dashboardLanguage") || "th";

let dataCache = null;
let lastIPsJSON = "";
let lastEventsJSON = "";
let isLoading = false;

/* =========================
   TABLE STATE
========================= */

let ipSource = [];
let eventSource = [];

let eventSearchQuery = "";
let eventSortMode = "newest";
let eventCurrentPage = 1;
let eventPageSize = 10;

const safe = value =>
    String(value ?? "").replace(
        /[&<>"']/g,
        char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        })[char]
    );

function t(key) {
    return i18n[language][key] || key;
}

function updateText(id, value) {
    const element = $(id);

    if (!element) {
        return;
    }

    const next = String(value);

    if (element.textContent === next) {
        return;
    }

    element.textContent = next;

    element.classList.remove("value-change");

    void element.offsetWidth;

    element.classList.add("value-change");
}

/* Source: scripts/core/router.js */
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
        const resizeCharts = () => {
            if (typeof chartTimelineInstance !== "undefined" && chartTimelineInstance) chartTimelineInstance.resize();
            if (typeof chartRadarInstance !== "undefined" && chartRadarInstance) chartRadarInstance.resize();
            if (typeof chartDonutInstance !== "undefined" && chartDonutInstance) chartDonutInstance.resize();
            if (typeof chartGaugeInstance !== "undefined" && chartGaugeInstance) chartGaugeInstance.resize();
            if (typeof chartPathsInstance !== "undefined" && chartPathsInstance) chartPathsInstance.resize();
        };
        setTimeout(resizeCharts, 80);
        setTimeout(resizeCharts, 450);
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

/* Source: scripts/i18n/language.js */
/* =========================
   LANGUAGE
========================= */

function applyLanguage() {
    document.documentElement.lang = language;

    document
        .querySelectorAll("[data-i18n]")
        .forEach(element => {
            element.textContent =
                t(element.dataset.i18n);
        });

    document
        .querySelectorAll("[data-i18n-placeholder]")
        .forEach(element => {
            element.placeholder =
                t(element.dataset.i18nPlaceholder);
        });

    $("thBtn").classList.toggle(
        "active",
        language === "th"
    );

    $("enBtn").classList.toggle(
        "active",
        language === "en"
    );
}

function setLanguage(lang) {
    if (
        lang !== "th" &&
        lang !== "en"
    ) {
        return;
    }

    language = lang;

    localStorage.setItem(
        "dashboardLanguage",
        language
    );

    applyLanguage();

    lastIPsJSON = "";
    lastEventsJSON = "";

    if (dataCache) {
        render(dataCache, true);
    } else {
        renderEventTable();
    }
}

/* Source: scripts/core/date-time.js */
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

/* Source: scripts/core/detection.js */
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

/* Source: scripts/charts/dashboard-charts.js */
/* =========================
   MAIN RENDER
========================= */


/* =========================
   EXECUTIVE ECHARTS RENDERER
========================= */
let chartTimelineInstance = null;
let chartRadarInstance = null;
let chartDonutInstance = null;
let chartGaugeInstance = null;
let chartPathsInstance = null;

function escapeChartHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

function updateTimelineChart(data) {
    const timelineEl = $("chartTrafficTimeline");
    if (!timelineEl || typeof echarts === "undefined" || !data) return;

    if (!chartTimelineInstance) {
        chartTimelineInstance = echarts.init(timelineEl);
    }

    const selectedPeriod = $("timelinePeriod")?.value || "day";
    const stats = data.timeline_stats?.[selectedPeriod] || data.timeline_stats?.day || {};
    const labels = Array.isArray(stats.labels) ? stats.labels : [];
    const requestSeries = Array.isArray(stats.requests) ? stats.requests : [];
    const threatSeries = Array.isArray(stats.threats) ? stats.threats : [];

    // BI Best Practice: Dynamic scale headroom for threat axis (Right Y-axis).
    const maxThreat = threatSeries.length ? Math.max(...threatSeries) : 0;
    const threatAxisMax = maxThreat === 0 ? 5 : Math.max(10, Math.ceil(maxThreat * 2.5));

    chartTimelineInstance.setOption({
        backgroundColor: "transparent",
        tooltip: {
            trigger: "axis",
            backgroundColor: "#ffffff",
            borderColor: "#e2e8f0",
            borderWidth: 1,
            padding: [10, 14],
            textStyle: { color: "#1e293b", fontFamily: "Sarabun" },
            className: "dashboard-chart-tooltip",
            axisPointer: {
                type: "line",
                lineStyle: { color: "#94a3b8", type: "dashed" },
                label: { show: false } // No ugly decimal labels on Y-axes!
            },
            formatter: function(params) {
                if (!params || !params.length) return "";
                const idx = params[0].dataIndex;
                const rawLabel = params[0].axisValue;
                const isTh = language === "th";
                let header = rawLabel;

                if (selectedPeriod === "quarter") {
                    let clean = rawLabel;
                    if (rawLabel.includes("ปัจจุบัน") || rawLabel.includes("Now")) {
                        clean = isTh ? `${rawLabel.split(" ")[0]} (ข้อมูลถึงปัจจุบัน)` : `${rawLabel.split(" ")[0]} (Up to date)`;
                    } else if (rawLabel.includes("-")) {
                        const parts = rawLabel.split("-");
                        if (parts[0] === parts[1]) {
                            clean = isTh ? `${parts[0]} (ข้อมูลถึงปัจจุบัน)` : `${parts[0]} (Up to date)`;
                        } else {
                            clean = `${parts[0]} - ${parts[1]}`;
                        }
                    }
                    header = isTh
                        ? `สัปดาห์ที่ ${idx + 1} · ช่วงวันที่ ${clean}`
                        : `Week ${idx + 1} · Date Range: ${clean}`;
                } else if (selectedPeriod === "day") {
                    header = isTh ? `ช่วงเวลา ${rawLabel} น.` : `Hour ${rawLabel}`;
                } else if (selectedPeriod === "month") {
                    header = isTh ? `วันที่ ${rawLabel}` : `Date ${rawLabel}`;
                } else if (selectedPeriod === "year") {
                    header = isTh ? `เดือน ${rawLabel}` : `Month ${rawLabel}`;
                }

                const reqVal = Number(requestSeries[idx] || 0);
                const threatVal = Number(threatSeries[idx] || 0);
                const threatStateClass = threatVal > 0 ? "is-danger" : "is-muted";
                const reqUnit = isTh ? "รายการ" : "requests";
                const threatUnit = isTh ? "เหตุการณ์" : "incidents";

                return `
                    <div class="chart-tooltip-title">${header}</div>
                    <div class="chart-tooltip-row">
                        <span class="chart-tooltip-label"><span class="chart-tooltip-dot is-request"></span>${isTh ? "คำขอทั้งหมด" : "Total Requests"}</span>
                        <span class="chart-tooltip-value">${reqVal.toLocaleString()} <span class="chart-tooltip-unit">${reqUnit}</span></span>
                    </div>
                    <div class="chart-tooltip-row">
                        <span class="chart-tooltip-label"><span class="chart-tooltip-dot ${threatStateClass}"></span>${isTh ? "เหตุการณ์ภัยคุกคาม" : "Threat Incursions"}</span>
                        <span class="chart-tooltip-value ${threatStateClass}">${threatVal.toLocaleString()} <span class="chart-tooltip-unit">${threatUnit}</span></span>
                    </div>
                `;
            }
        },
        grid: { left: "3%", right: "6%", bottom: "4%", top: "16%", containLabel: true },
        xAxis: {
            type: "category",
            boundaryGap: selectedPeriod === "quarter",
            data: labels,
            axisLine: { lineStyle: { color: "#cbd5e1" } },
            axisLabel: {
                color: "#64748b",
                fontFamily: "Sarabun",
                fontSize: 12,
                formatter: function(val, idx) {
                    if (selectedPeriod === "quarter") {
                        const isTh = language === "th";
                        let shortVal = val;
                        if (val.includes("ปัจจุบัน") || val.includes("Now")) {
                            shortVal = `${val.split(" ")[0]} ${isTh ? "ปัจจุบัน" : "Now"}`;
                        } else if (val.includes("-")) {
                            const p = val.split("-");
                            if (p[0] === p[1]) shortVal = `${p[0]} ${isTh ? "ปัจจุบัน" : "Now"}`;
                        }
                        return isTh ? `สัปดาห์ ${idx + 1}\n(${shortVal})` : `W${idx + 1}\n(${shortVal})`;
                    }
                    return val;
                }
            }
        },
        yAxis: [
            {
                type: "value",
                name: language === "th" ? "คำขอ (Requests)" : "Requests",
                nameTextStyle: { color: "#0a4f82", fontFamily: "Sarabun", fontWeight: 600, fontSize: 11.5 },
                minInterval: 1,
                splitLine: { lineStyle: { color: "#f1f5f9", type: "dashed" } },
                axisLabel: {
                    color: "#64748b", fontFamily: "Sarabun", fontSize: 11.5,
                    formatter: val => val >= 1000 ? (val / 1000).toFixed(1) + "k" : val
                }
            },
            {
                type: "value",
                name: language === "th" ? "ภัยคุกคาม (Threats)" : "Threats",
                nameTextStyle: { color: "#b73b45", fontFamily: "Sarabun", fontWeight: 600, fontSize: 11.5 },
                min: 0,
                max: threatAxisMax,
                minInterval: 1,
                splitLine: { show: false },
                axisLabel: { color: "#b73b45", fontFamily: "Sarabun", fontSize: 11.5 }
            }
        ],
        series: [
            {
                name: language === "th" ? "คำขอทั้งหมด" : "Total Requests",
                type: "line",
                yAxisIndex: 0,
                smooth: 0.35,
                showSymbol: labels.length <= 31,
                symbol: "circle",
                symbolSize: 6,
                itemStyle: { color: "#0a6aa1" },
                lineStyle: { width: 2.5, color: "#0a6aa1" },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: "rgba(10, 106, 161, .25)" },
                        { offset: 1, color: "rgba(10, 106, 161, .01)" }
                    ])
                },
                data: requestSeries
            },
            {
                name: language === "th" ? "ภัยคุกคาม" : "Threat Incursions",
                type: "line",
                yAxisIndex: 1,
                smooth: 0.35,
                showSymbol: labels.length <= 31,
                symbol: "diamond",
                symbolSize: 7,
                itemStyle: { color: "#d9434d" },
                lineStyle: { width: 2.5, color: "#d9434d", shadowColor: "rgba(217, 67, 77, 0.3)", shadowBlur: 6 },
                data: threatSeries
            }
        ]
    }, true);
}

function updateSecurityGauge(data) {
    const gaugeEl = $("chartSecurityGauge");
    if (!gaugeEl || typeof echarts === "undefined" || !data) return;
    if (!chartGaugeInstance) chartGaugeInstance = echarts.init(gaugeEl);

    const selectedPeriod = $("securityPeriod")?.value || "day";
    const stats = data.security_score_stats?.[selectedPeriod] || {};
    const score = Number.isFinite(Number(stats.score)) ? Number(stats.score) : 0;
    const color = score >= 90 ? "#10b981" : score >= 75 ? "#f59e0b" : "#ef4444";
    const gradientColors = score >= 90
        ? [{ offset: 0, color: "#34d399" }, { offset: 1, color: "#059669" }]
        : score >= 75
            ? [{ offset: 0, color: "#fbbf24" }, { offset: 1, color: "#d97706" }]
            : [{ offset: 0, color: "#f87171" }, { offset: 1, color: "#dc2626" }];
    const glowColor = score >= 90 ? "rgba(16, 185, 129, 0.3)" : score >= 75 ? "rgba(245, 158, 11, 0.3)" : "rgba(239, 68, 68, 0.3)";

    const label = score >= 90
        ? (language === "th" ? "มั่นคง" : "Secure")
        : score >= 75
            ? (language === "th" ? "เฝ้าระวัง" : "Monitor")
            : (language === "th" ? "มีความเสี่ยง" : "At Risk");

    chartGaugeInstance.setOption({
        backgroundColor: "transparent",
        tooltip: { show: false }, // User requirement: "ไม่ต้องทำ hold ตอนเอาเม้าไปชี้ สำหรับกราฟนี้"
        series: [{
            type: "gauge",
            startAngle: 215,
            endAngle: -35,
            min: 0,
            max: 100,
            splitNumber: 4, // 0%, 25%, 50%, 75%, 100%
            center: ["50%", "53%"], // Symmetrically centered within the white card
            radius: "76%", // Sized proportionally so outside labels fit comfortably
            axisLine: {
                roundCap: true,
                lineStyle: {
                    width: 11,
                    color: [
                        [0.75, "#fee2e2"],
                        [0.90, "#fef3c7"],
                        [1.00, "#d1fae5"]
                    ]
                }
            },
            progress: {
                show: true,
                roundCap: true,
                width: 11,
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 1, 0, gradientColors),
                    shadowColor: glowColor,
                    shadowBlur: 8
                }
            },
            pointer: {
                show: true,
                length: "28%", // Shortened so it NEVER reaches down into the text!
                width: 3,
                offsetCenter: [0, 0],
                itemStyle: {
                    color: "#1e293b",
                    shadowColor: "rgba(15, 23, 42, 0.25)",
                    shadowBlur: 4,
                    shadowOffsetY: 1
                }
            },
            anchor: {
                show: true,
                showAbove: true,
                size: 7,
                itemStyle: {
                    color: "#ffffff",
                    borderWidth: 2,
                    borderColor: color
                }
            },
            splitLine: {
                show: true,
                distance: -14, // OUTSIDE the arc
                length: 5,
                lineStyle: { color: "#94a3b8", width: 1.5 }
            },
            axisTick: {
                show: true,
                distance: -11, // OUTSIDE the arc
                length: 2.5,
                splitNumber: 5,
                lineStyle: { color: "#cbd5e1", width: 1 }
            },
            axisLabel: {
                distance: -24, // OUTSIDE the arc (0%, 25%, 50%, 75%, 100%)
                color: "#64748b",
                fontFamily: "Sarabun",
                fontSize: 10,
                fontWeight: 600,
                formatter: val => `${val}%`
            },
            detail: {
                valueAnimation: true,
                formatter: v => `${Number(v).toFixed(1)}%`,
                offsetCenter: [0, "28%"], // Placed cleanly BELOW the needle in the center!
                color: "#0f172a",
                fontFamily: "Sarabun",
                fontSize: 24,
                fontWeight: 800
            },
            title: {
                show: true,
                offsetCenter: [0, "52%"], // Directly below the % score
                color: color,
                fontFamily: "Sarabun",
                fontSize: 12,
                fontWeight: 700
            },
            data: [{ value: score, name: `● ${label}` }]
        }]
    }, true);

    const meta = $("securityGaugeMeta");
    if (meta) {
        const requests = Number(stats.requests || 0).toLocaleString();
        const attacks = Number(stats.malicious_attempts || 0).toLocaleString();
        meta.innerHTML = language === "th"
            ? `<span>คำขอ <strong>${requests}</strong></span><span class="gauge-meta-separator">•</span><span>พยายามโจมตี <strong class="${Number(attacks) > 0 ? "is-danger" : ""}">${attacks}</strong></span>`
            : `<span>Requests <strong>${requests}</strong></span><span class="gauge-meta-separator">•</span><span>Malicious attempts <strong class="${Number(attacks) > 0 ? "is-danger" : ""}">${attacks}</strong></span>`;
    }
}

function initializeChartPeriodControl(id, storageKey, renderer) {
    const control = $(id);
    if (!control) return;
    const saved = localStorage.getItem(storageKey);
    if (["day", "month", "quarter", "year"].includes(saved)) control.value = saved;
    control.addEventListener("change", () => {
        localStorage.setItem(storageKey, control.value);
        if (dataCache) renderer(dataCache);
    });
}

initializeChartPeriodControl("timelinePeriod", "dashboardTimelinePeriod", updateTimelineChart);
initializeChartPeriodControl("securityPeriod", "dashboardSecurityPeriod", updateSecurityGauge);

function renderSecurityCharts(data) {
    if (typeof echarts === "undefined" || !data) return;

    const severityCount = data.severity_count || {};
    const highCount = severityCount.HIGH || 0;
    const medCount = severityCount.MEDIUM || 0;
    const lowCount = severityCount.LOW || 0;
    const events = Array.isArray(data.events) ? data.events : [];

    // 1. Timeline Chart (exact request/event aggregations by selected period)
    updateTimelineChart(data);

    // 2. Evidence-based security level for the selected calendar period.
    updateSecurityGauge(data);

    // 3. Threat Radar Matrix (Computed from exact real counts, dynamic indicator ceiling)
    const radarEl = $("chartThreatRadar");
    if (radarEl) {
        if (!chartRadarInstance) {
            chartRadarInstance = echarts.init(radarEl);
        }
        let bruteCount = 0, injectCount = 0, probeCount = 0, floodCount = 0, scanCount = 0, lfiCount = 0;
        events.forEach(e => {
            const r = e.reasons || [];
            const t = e.attack_types || [];
            if (r.includes("LOGIN_BRUTE_FORCE") || t.includes("brute_force")) bruteCount++;
            if (r.includes("SUSPICIOUS_PATH") || r.includes("SENSITIVE_FILE_ACCESS") || t.includes("sensitive_file")) probeCount++;
            if (r.includes("RATE_LIMIT") || r.includes("HIGH_REQUEST_RATE") || t.includes("flood_dos")) floodCount++;
            if (r.includes("PATH_SCANNING") || r.includes("ACCESS_DENIED_BURST") || r.includes("SUSPICIOUS_PROBING") || t.includes("path_scanning")) scanCount++;
            if (r.includes("SQL_INJECTION") || r.includes("XSS_ATTACK") || r.includes("COMMAND_INJECTION") || t.includes("sql_injection") || t.includes("xss") || t.includes("command_injection")) injectCount++;
            if (r.includes("DIRECTORY_TRAVERSAL") || r.includes("LFI_PATH_TRAVERSAL") || t.includes("lfi") || t.includes("path_traversal")) lfiCount++;
        });

        if (data.attack_type_counts) {
            scanCount = Math.max(scanCount, data.attack_type_counts.path_scanning || 0);
            probeCount = Math.max(probeCount, data.attack_type_counts.sensitive_file || 0);
            floodCount = Math.max(floodCount, data.attack_type_counts.flood_dos || 0);
            bruteCount = Math.max(bruteCount, data.attack_type_counts.brute_force || 0);
            injectCount = Math.max(injectCount, data.attack_type_counts.injection || 0);
            lfiCount = Math.max(lfiCount, data.attack_type_counts.path_traversal || 0);
        }

        const maxAxis = Math.max(probeCount, bruteCount, injectCount, scanCount, floodCount, lfiCount, 10);
        const ceiling = Math.ceil(maxAxis * 1.15);

        chartRadarInstance.setOption({
            backgroundColor: "transparent",
            tooltip: {
                backgroundColor: "rgba(10, 25, 45, 0.94)",
                borderColor: "#0a4f82",
                textStyle: { color: "#ffffff", fontFamily: "Sarabun" },
                formatter: function(params) {
                    const d = params.value || [];
                    const names = [
                        language === "th" ? "เจาะไฟล์ระบบสำคัญ" : "Sensitive Files",
                        language === "th" ? "พยายามสุ่มรหัสผ่าน" : "Brute Force",
                        language === "th" ? "แทรกแซงโค้ดคำสั่ง" : "Injection Payloads",
                        language === "th" ? "สแกนหาช่องโหว่" : "Vulnerability Scan",
                        language === "th" ? "ส่งคำขอถี่ผิดปกติ" : "Rate Limit Flood",
                        language === "th" ? "เข้าถึงไฟล์นอกขอบเขต" : "LFI / Traversal"
                    ];
                    let tip = `<div class="chart-tooltip-series-title">${params.seriesName}</div>`;
                    names.forEach((n, idx) => {
                        tip += `<div>${n}: <b>${d[idx] || 0}</b> เหตุการณ์</div>`;
                    });
                    return tip;
                }
            },
            radar: {
                indicator: [
                    { name: language === "th" ? "เจาะไฟล์ระบบสำคัญ" : "Sensitive Files", max: ceiling },
                    { name: language === "th" ? "พยายามสุ่มรหัสผ่าน" : "Brute Force", max: ceiling },
                    { name: language === "th" ? "แทรกแซงโค้ดคำสั่ง" : "Injection Payloads", max: ceiling },
                    { name: language === "th" ? "สแกนหาช่องโหว่" : "Vulnerability Scan", max: ceiling },
                    { name: language === "th" ? "ส่งคำขอถี่ผิดปกติ" : "Rate Limit Flood", max: ceiling },
                    { name: language === "th" ? "เข้าถึงไฟล์นอกขอบเขต" : "LFI / Traversal", max: ceiling }
                ],
                shape: "polygon",
                splitNumber: 4,
                axisName: { color: "#1a2738", fontWeight: "600", fontFamily: "Sarabun", fontSize: 11 },
                splitLine: { lineStyle: { color: "#dde6ee" } },
                splitArea: {
                    show: true,
                    areaStyle: {
                        color: ["rgba(243, 246, 249, 0.8)", "rgba(237, 246, 252, 0.5)", "rgba(243, 246, 249, 0.8)", "rgba(237, 246, 252, 0.5)"]
                    }
                },
                axisLine: { lineStyle: { color: "#cbd5e1" } }
            },
            series: [{
                name: language === "th" ? "ดัชนีภัยคุกคามจริง" : "Threat Radar",
                type: "radar",
                data: [{
                    value: [probeCount, bruteCount, injectCount, scanCount, floodCount, lfiCount],
                    name: language === "th" ? "จำนวนเหตุการณ์ภัยคุกคาม" : "Attack Count",
                    itemStyle: { color: "#0a4f82" },
                    areaStyle: {
                        color: new echarts.graphic.RadialGradient(0.5, 0.5, 1, [
                            { offset: 0, color: "rgba(10, 79, 130, 0.5)" },
                            { offset: 1, color: "rgba(217, 67, 77, 0.25)" }
                        ])
                    },
                    lineStyle: { width: 2.5, color: "#0a4f82" },
                    symbol: "circle",
                    symbolSize: 6
                }]
            }]
        });
    }

    // 4. Attack Vectors & Severity Distribution
    const donutEl = $("chartAttackVectors");
    if (donutEl) {
        if (!chartDonutInstance) {
            chartDonutInstance = echarts.init(donutEl);
        }
        chartDonutInstance.setOption({
            backgroundColor: "transparent",
            tooltip: {
                trigger: "item",
                backgroundColor: "rgba(10, 25, 45, 0.94)",
                borderColor: "#0a4f82",
                textStyle: { color: "#ffffff", fontFamily: "Sarabun" },
                formatter: "{b}: <b>{c}</b> เหตุการณ์ ({d}%)"
            },
            legend: {
                bottom: "0%",
                left: "center",
                textStyle: { color: "#728198", fontFamily: "Sarabun", fontSize: 11 },
                itemWidth: 10,
                itemHeight: 10
            },
            series: [{
                name: "Severity",
                type: "pie",
                radius: ["45%", "70%"],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 8,
                    borderColor: "#ffffff",
                    borderWidth: 2
                },
                label: { show: false, position: "center" },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 14,
                        fontWeight: "bold",
                        fontFamily: "Sarabun",
                        formatter: "{b}: {d}%"
                    }
                },
                labelLine: { show: false },
                data: [
                    { value: highCount, name: language === "th" ? "ความเสี่ยงสูง" : "High Risk", itemStyle: { color: "#d9434d" } },
                    { value: medCount, name: language === "th" ? "ความเสี่ยงปานกลาง" : "Medium Risk", itemStyle: { color: "#d98a00" } },
                    { value: lowCount, name: language === "th" ? "ความเสี่ยงต่ำ" : "Low Risk", itemStyle: { color: "#159a65" } }
                ]
            }]
        });
    }

    // 5. Top Targeted Endpoints (Accurate targeted attacked paths)
    const pathsEl = $("chartTargetedPaths");
    if (pathsEl) {
        if (!chartPathsInstance) {
            chartPathsInstance = echarts.init(pathsEl);
        }
        const targetedList = (data.top_targeted_paths && data.top_targeted_paths.length > 0)
            ? data.top_targeted_paths.slice(0, 7)
            : (data.top_paths || []).slice(0, 7);
        const pathNames = targetedList.map(p => p[0].length > 25 ? p[0].substring(0, 23) + "..." : p[0]).reverse();
        const pathCounts = targetedList.map(p => p[1]).reverse();

        chartPathsInstance.setOption({
            backgroundColor: "transparent",
            tooltip: {
                trigger: "axis",
                axisPointer: { type: "shadow" },
                backgroundColor: "rgba(10, 25, 45, 0.94)",
                borderColor: "#0a4f82",
                textStyle: { color: "#ffffff", fontFamily: "Sarabun" },
                formatter: function(params) {
                    if (!params || !params.length) return "";
                    const item = params[0];
                    const safeName = escapeChartHtml(item.name);
                    const safeValue = Number(item.value || 0).toLocaleString();
                    return `<div><b>${safeName}</b></div><div>${language === "th" ? "คำขอโจมตี / เป้าหมาย" : "Targeted requests"}: <b>${safeValue}</b> ครั้ง</div>`;
                }
            },
            grid: { left: "3%", right: "12%", bottom: "3%", top: "5%", containLabel: true },
            xAxis: {
                type: "value",
                splitLine: { lineStyle: { color: "#edf2f7", type: "dashed" } },
                axisLabel: { color: "#64748b", fontFamily: "Sarabun" }
            },
            yAxis: {
                type: "category",
                data: pathNames,
                axisLine: { lineStyle: { color: "#cbd5e1" } },
                axisLabel: { color: "#1a2738", fontWeight: "600", fontFamily: "Sarabun", fontSize: 11 }
            },
            series: [{
                name: language === "th" ? "จำนวนคำขอเป้าหมาย" : "Targeted Requests",
                type: "bar",
                barWidth: 15,
                itemStyle: {
                    borderRadius: [0, 8, 8, 0],
                    color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                        { offset: 0, color: "#0a4f82" },
                        { offset: 0.7, color: "#0284c7" },
                        { offset: 1, color: "#06b6d4" }
                    ])
                },
                label: {
                    show: true,
                    position: "right",
                    color: "#0a4f82",
                    fontWeight: "600",
                    fontFamily: "Sarabun"
                },
                data: pathCounts
            }]
        });
    }
}

window.addEventListener("resize", () => {
    if (chartTimelineInstance) chartTimelineInstance.resize();
    if (chartRadarInstance) chartRadarInstance.resize();
    if (chartDonutInstance) chartDonutInstance.resize();
    if (chartGaugeInstance) chartGaugeInstance.resize();
    if (chartPathsInstance) chartPathsInstance.resize();
});

function render(
    data,
    force = false
) {
    renderSecurityCharts(data);
    dataCache = data;

    updateText(
        "total",
        data.total_requests ?? 0
    );

    updateText(
        "ips",
        data.unique_ips ?? 0
    );

    updateText(
        "eventsCount",
        data.security_events ?? 0
    );

    updateText(
        "anomalies",
        data.ai_anomalies ?? 0
    );

    updateText(
        "high",
        data.severity_count?.HIGH ?? 0
    );

    const aiEnabled = Boolean(data.ai_enabled);
    const aiState = data.model?.status || "BASELINE_COLLECTING";

    const aiHTML =
        aiEnabled
            ? `<span class="badge active">${safe(t("active"))}</span>`
            : `<span class="badge waiting">${safe(t(aiState))}</span>`;

    if (
        $("aiStatus").innerHTML !== aiHTML ||
        force
    ) {
        $("aiStatus").innerHTML =
            aiHTML;
    }

    const aiDetail = aiState === "APPROVED"
        ? t("aiReadyDetail")
        : aiState === "BASELINE_COLLECTING" || aiState === "VALIDATION_REQUIRED"
            ? t("aiCollectingDetail")
            : t("aiAttentionDetail");

    if (
        $("aiDetail").textContent !== aiDetail ||
        force
    ) {
        $("aiDetail").textContent =
            aiDetail;
    }

    const ips =
        Array.isArray(data.top_ips)
            ? data.top_ips
            : [];

    const events =
        Array.isArray(data.events)
            ? data.events
            : [];

    window.dashboardNotifications?.update(events, {
        language,
        force
    });

    const ipsJSON =
        JSON.stringify(ips);

    const eventsJSON =
        JSON.stringify(events);

    if (
        force ||
        ipsJSON !== lastIPsJSON
    ) {
        ipSource = ips;
        renderIPs();

        lastIPsJSON =
            ipsJSON;
    }

    if (
        force ||
        eventsJSON !== lastEventsJSON
    ) {
        eventSource = events;

        renderEventTable();

        lastEventsJSON =
            eventsJSON;
    }
}

/* Source: scripts/components/top-ip-table.js */
/* =========================
   TOP IP TABLE
========================= */

let ipSortMode = "most";

function compareIp(a, b) {
    const partsA = String(a).split(".").map(Number);
    const partsB = String(b).split(".").map(Number);
    for (let i = 0; i < 4; i++) {
        const diff = (partsA[i] || 0) - (partsB[i] || 0);
        if (diff !== 0) return diff;
    }
    return String(a).localeCompare(String(b));
}

function renderIPs() {
    const items = [...ipSource].sort((a, b) => {
        const ipA = Array.isArray(a) ? String(a[0] || "") : "";
        const ipB = Array.isArray(b) ? String(b[0] || "") : "";
        const countA = Array.isArray(a) ? Number(a[1] || 0) : 0;
        const countB = Array.isArray(b) ? Number(b[1] || 0) : 0;
        const lastSeenA = Array.isArray(a) && a[2] ? new Date(a[2]).getTime() : 0;
        const lastSeenB = Array.isArray(b) && b[2] ? new Date(b[2]).getTime() : 0;
        const firstSeenA = Array.isArray(a) && a[3] ? new Date(a[3]).getTime() : (lastSeenA || 0);
        const firstSeenB = Array.isArray(b) && b[3] ? new Date(b[3]).getTime() : (lastSeenB || 0);

        if (ipSortMode === "most") {
            return countB !== countA ? countB - countA : compareIp(ipA, ipB);
        } else if (ipSortMode === "least") {
            return countB !== countA ? countA - countB : compareIp(ipA, ipB);
        } else if (ipSortMode === "newest") {
            return lastSeenB !== lastSeenA ? lastSeenB - lastSeenA : countB - countA;
        } else if (ipSortMode === "oldest") {
            return firstSeenA !== firstSeenB ? firstSeenA - firstSeenB : countB - countA;
        } else if (ipSortMode === "ip") {
            return compareIp(ipA, ipB);
        }
        return countB - countA;
    });

    ["homeIpCount", "historyIpCount"].forEach(id => {
        $(id).textContent = t("topIpsCount").replace("{count}", items.length);
    });

    if (!items.length) {
        ["homeIpList", "ipList"].forEach(id => {
            $(id).innerHTML =
                `<div class="empty">${safe(t("noData"))}</div>`;
        });

        return;
    }

    const rows = items
            .map(item => {

                const ip =
                    Array.isArray(item)
                        ? item[0]
                        : "-";

                const count =
                    Array.isArray(item)
                        ? item[1]
                        : 0;

                return `
                    <div class="ip-row">

                        <div class="ip-value">
                            ${safe(ip)}
                        </div>

                        <div class="count">
                            ${safe(count)}
                        </div>

                    </div>
                `;
            })
            .join("");

    ["homeIpList", "ipList"].forEach(id => {
        $(id).innerHTML = rows;
    });
}

/* Source: scripts/components/event-search.js */
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

/* Source: scripts/components/event-sorting.js */
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

/* Source: scripts/components/event-filtering.js */
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

/* Source: scripts/components/event-table.js */
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

/* Source: scripts/components/pagination.js */
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

/* Source: scripts/services/dashboard-service.js */
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

/* Source: scripts/app/events.js */
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

/* Source: scripts/app/bootstrap.js */
/* =========================
   START
========================= */

async function start() {
    applyLanguage();

    try {
        await loadDashboard();
    } catch (e) {
        console.error("loadDashboard error in start():", e);
    } finally {
        setTimeout(() => {
            const loaderEl = $("loader");
            if (loaderEl) loaderEl.classList.add("hide");
            const appEl = $("app");
            if (appEl) appEl.classList.add("show");
        }, 200);
    }
}

start();

    // Ensure all dialogs are properly closed on initial load
    try {
        const bd = document.getElementById("blockDetailDialog");
        if (bd && bd.open) bd.close();
        const ed = document.getElementById("eventLabelDialog");
        if (ed && ed.open) ed.close();
    } catch (e) {}


/* =========================
   NEAR REALTIME
========================= */

setInterval(
    () => {

        if (!document.hidden) {
            loadDashboard();
        }

    },
    window.KeroroDashboardConfig.dashboardRefreshMs
);

/* Source: scripts/components/toast.js */
/* Accessible top-center notifications shared by dashboard actions. */
(() => {
    "use strict";
    const active = new Map();
    const actionLocks = new Set();
    const dismissCallbacks = new WeakMap();

    function region() {
        let element = document.getElementById("dashboardToastRegion");
        if (element) return element;
        element = document.createElement("div");
        element.id = "dashboardToastRegion";
        element.className = "dashboard-toast-region";
        element.setAttribute("aria-label", "System notifications");
        document.body.appendChild(element);
        return element;
    }

    function icon(type) {
        const wrapper = document.createElement("span");
        wrapper.className = "dashboard-toast-icon";
        wrapper.setAttribute("aria-hidden", "true");
        wrapper.innerHTML = type === "error"
            ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 8v5"/><path d="M12 17h.01"/><path d="M10.3 3.7 2.5 17.2A2 2 0 0 0 4.2 20h15.6a2 2 0 0 0 1.7-2.8L13.7 3.7a2 2 0 0 0-3.4 0Z"/></svg>'
            : type === "info"
                ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5v5l3 1.8"/></svg>'
                : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.2 4.2L19 7"/></svg>';
        return wrapper;
    }

    function dismiss(element, key) {
        if (!element || element.dataset.leaving === "true") return;
        element.dataset.leaving = "true";
        element.classList.remove("is-visible");
        element.classList.add("is-leaving");
        window.setTimeout(() => {
            element.remove();
            const callback = dismissCallbacks.get(element);
            dismissCallbacks.delete(element);
            if (callback) callback();
        }, 260);
        if (key && active.get(key)?.element === element) active.delete(key);
    }

    function show({type = "success", title = "", message = "", key = "", duration, onDismiss} = {}) {
        const normalizedType = ["error", "info"].includes(type) ? type : "success";
        const timeout = Number.isFinite(duration) ? duration : (normalizedType === "error" ? 5600 : 3800);
        if (key && active.has(key)) {
            const previous = active.get(key);
            window.clearTimeout(previous.timer);
            dismiss(previous.element, key);
        }

        const toast = document.createElement("section");
        toast.className = `dashboard-toast dashboard-toast--${normalizedType}`;
        toast.setAttribute("role", normalizedType === "error" ? "alert" : "status");
        toast.setAttribute("aria-live", normalizedType === "error" ? "assertive" : "polite");
        toast.setAttribute("aria-atomic", "true");
        const durationClass = timeout <= 2200
            ? "dashboard-toast--duration-short"
            : (timeout >= 5600 ? "dashboard-toast--duration-long" : "dashboard-toast--duration-standard");
        toast.classList.add(durationClass);
        if (typeof onDismiss === "function") dismissCallbacks.set(toast, onDismiss);
        toast.appendChild(icon(normalizedType));

        const content = document.createElement("div");
        content.className = "dashboard-toast-content";
        const heading = document.createElement("strong");
        heading.textContent = title || (normalizedType === "error" ? "ไม่สำเร็จ" : "สำเร็จ");
        const detail = document.createElement("span");
        detail.textContent = String(message || "");
        content.append(heading, detail);
        toast.appendChild(content);

        const close = document.createElement("button");
        close.className = "dashboard-toast-close";
        close.type = "button";
        close.setAttribute("aria-label", "ปิดการแจ้งเตือน");
        close.textContent = "×";
        close.addEventListener("click", () => dismiss(toast, key));
        toast.appendChild(close);

        const progress = document.createElement("span");
        progress.className = "dashboard-toast-progress";
        progress.setAttribute("aria-hidden", "true");
        toast.appendChild(progress);
        region().prepend(toast);
        requestAnimationFrame(() => toast.classList.add("is-visible"));

        const timer = window.setTimeout(() => dismiss(toast, key), timeout);
        if (key) active.set(key, {element: toast, timer});
        return () => {
            window.clearTimeout(timer);
            dismiss(toast, key);
        };
    }

    function setButtonBusy(button, busy) {
        if (!button) return;
        button.classList.toggle("ui-action-busy", Boolean(busy));
        button.setAttribute("aria-busy", String(Boolean(busy)));
        button.setAttribute("aria-disabled", String(Boolean(busy)));
    }

    const actions = Object.freeze({
        begin(key) {
            if (!key || actionLocks.has(key)) return false;
            actionLocks.add(key);
            return true;
        },
        finish(key, options = {}) {
            return show({...options, key, onDismiss: () => actionLocks.delete(key)});
        },
        wait(key, options = {}) {
            return show({type: "info", duration: 2200, ...options, key: `${key || "action"}-wait`});
        },
        release(key) { actionLocks.delete(key); },
        isLocked(key) { return actionLocks.has(key); },
    });

    window.dashboardNotify = Object.freeze({show, actions});
    window.dashboardButtonBusy = setButtonBusy;
})();

/* Source: scripts/components/notification-center.js */
/* Header notification center. Reuses the dashboard event snapshot; no extra polling. */
(() => {
    "use strict";

    const MAX_ITEMS = 10;
    const MAX_SEEN = 300;
    const STORAGE_PREFIX = "keroro:notifications:seen:";
    const state = {
        ready: false,
        open: false,
        language: "th",
        user: "dashboard-user",
        items: [],
        seen: new Set(),
        visibleUnread: new Set(),
        closeTimer: null,
        lastSignature: "",
        lastUnreadCount: 0,
    };

    const $ = id => document.getElementById(id);
    const copy = {
        th: {
            title: "การแจ้งเตือนล่าสุด",
            subtitle: "เหตุการณ์ล่าสุดจาก 10 IP",
            empty: "ยังไม่มีเหตุการณ์ความปลอดภัย",
            updated: "อัปเดตอัตโนมัติ",
            unread: count => `${count} รายการที่ยังไม่ได้อ่าน`,
            open: "เปิดการแจ้งเตือน",
            close: "ปิดการแจ้งเตือน",
            HIGH: "สูง",
            MEDIUM: "ปานกลาง",
            LOW: "ต่ำ",
        },
        en: {
            title: "Recent notifications",
            subtitle: "Latest events from 10 IPs",
            empty: "No security events yet",
            updated: "Updates automatically",
            unread: count => `${count} unread ${count === 1 ? "item" : "items"}`,
            open: "Open notifications",
            close: "Close notifications",
            HIGH: "High",
            MEDIUM: "Medium",
            LOW: "Low",
        },
    };

    function text(key, value) {
        const entry = copy[state.language]?.[key] ?? copy.th[key] ?? key;
        return typeof entry === "function" ? entry(value) : entry;
    }

    function eventTime(event) {
        const raw = String(event?.time || event?.minute || "");
        const normalized = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(raw) ? `${raw}:00Z` : raw;
        const value = Date.parse(normalized);
        return Number.isFinite(value) ? value : 0;
    }

    function eventKey(event) {
        if (event?.event_id) return String(event.event_id);
        const reasons = Array.isArray(event?.reasons) ? event.reasons.join(",") : "";
        return `${event?.ip || "unknown"}|${event?.time || event?.minute || ""}|${reasons}`;
    }

    function latestUnique(events) {
        const byIp = new Map();
        for (const event of Array.isArray(events) ? events : []) {
            const ip = String(event?.ip || "").trim();
            if (!ip) continue;
            const current = byIp.get(ip);
            if (!current || eventTime(event) > eventTime(current)) byIp.set(ip, event);
        }
        return [...byIp.values()]
            .sort((left, right) => eventTime(right) - eventTime(left) || eventKey(right).localeCompare(eventKey(left)))
            .slice(0, MAX_ITEMS);
    }

    function storageKey() {
        return `${STORAGE_PREFIX}${state.user}`;
    }

    function loadSeen() {
        try {
            const values = JSON.parse(localStorage.getItem(storageKey()) || "[]");
            state.seen = new Set(Array.isArray(values) ? values.slice(-MAX_SEEN) : []);
        } catch (_) {
            state.seen = new Set();
        }
    }

    function saveSeen() {
        try {
            localStorage.setItem(storageKey(), JSON.stringify([...state.seen].slice(-MAX_SEEN)));
        } catch (_) {
            // The notification center still works when storage is unavailable.
        }
    }

    function formatTime(event) {
        const timestamp = eventTime(event);
        if (!timestamp) return "—";
        return new Intl.DateTimeFormat(state.language === "th" ? "th-TH" : "en-GB", {
            timeZone: "Asia/Bangkok",
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        }).format(new Date(timestamp));
    }

    function reason(event) {
        if (state.language === "th" && event?.reason_th) return String(event.reason_th);
        const reasons = Array.isArray(event?.reasons) ? event.reasons : [];
        if (reasons.length) return reasons.map(value => String(value).replaceAll("_", " ")).join(" · ");
        if (Array.isArray(event?.evidence) && event.evidence[0]) return String(event.evidence[0]);
        return state.language === "th" ? "ตรวจพบรูปแบบการเข้าถึงที่ควรตรวจสอบ" : "Access pattern requires review";
    }

    function unreadItems() {
        return state.items.filter(item => !state.seen.has(eventKey(item)));
    }

    function renderBadge() {
        const badge = $("notificationBadge");
        const trigger = $("notificationTrigger");
        if (!badge || !trigger) return;
        const count = state.open ? 0 : unreadItems().length;
        badge.hidden = count === 0;
        badge.textContent = count > 9 ? "9+" : String(count);
        trigger.classList.toggle("has-unread", count > 0);
        if (count > state.lastUnreadCount) {
            trigger.classList.remove("is-alerting");
            void trigger.offsetWidth;
            trigger.classList.add("is-alerting");
        } else if (!count) {
            trigger.classList.remove("is-alerting");
        }
        state.lastUnreadCount = count;
        trigger.setAttribute("aria-label", count ? `${text("open")} · ${text("unread", count)}` : text("open"));
    }

    function createItem(event) {
        const key = eventKey(event);
        const item = document.createElement("article");
        item.className = "notification-item";
        if (state.visibleUnread.has(key)) item.classList.add("is-unread");

        const marker = document.createElement("span");
        marker.className = `notification-severity notification-severity--${String(event?.severity || "LOW").toLowerCase()}`;
        marker.setAttribute("aria-hidden", "true");

        const body = document.createElement("div");
        body.className = "notification-item-body";
        const top = document.createElement("div");
        top.className = "notification-item-top";
        const ip = document.createElement("strong");
        ip.textContent = String(event?.ip || "—");
        const time = document.createElement("time");
        time.dateTime = String(event?.time || event?.minute || "");
        time.textContent = formatTime(event);
        top.append(ip, time);

        const detail = document.createElement("p");
        detail.textContent = reason(event);
        const meta = document.createElement("div");
        meta.className = "notification-item-meta";
        const severity = document.createElement("span");
        const level = String(event?.severity || "LOW").toUpperCase();
        severity.className = `notification-risk notification-risk--${level.toLowerCase()}`;
        severity.textContent = text(level);
        const requests = document.createElement("span");
        requests.textContent = state.language === "th"
            ? `${Number(event?.total_requests || 0).toLocaleString("th-TH")} คำขอ`
            : `${Number(event?.total_requests || 0).toLocaleString("en-US")} requests`;
        meta.append(severity, requests);
        body.append(top, detail, meta);
        item.append(marker, body);
        return item;
    }

    function renderPanel() {
        if (!state.ready) return;
        $("notificationTitle").textContent = text("title");
        $("notificationSubtitle").textContent = text("subtitle");
        $("notificationLiveText").textContent = text("updated");
        $("notificationClose").setAttribute("aria-label", text("close"));
        const list = $("notificationList");
        list.replaceChildren();
        if (!state.items.length) {
            const empty = document.createElement("div");
            empty.className = "notification-empty";
            empty.textContent = text("empty");
            list.appendChild(empty);
        } else {
            list.append(...state.items.map(createItem));
        }
        renderBadge();
    }

    function markVisibleRead() {
        for (const item of state.items) state.seen.add(eventKey(item));
        saveSeen();
        renderBadge();
    }

    function openPanel() {
        if (state.open) return;
        state.open = true;
        clearTimeout(state.closeTimer);
        state.visibleUnread = new Set(unreadItems().map(eventKey));
        renderPanel();
        const panel = $("notificationPanel");
        panel.hidden = false;
        $("notificationTrigger").setAttribute("aria-expanded", "true");
        requestAnimationFrame(() => panel.classList.add("is-open"));
        markVisibleRead();
    }

    function closePanel({focus = false} = {}) {
        if (!state.open) return;
        state.open = false;
        state.visibleUnread.clear();
        const panel = $("notificationPanel");
        panel.classList.remove("is-open");
        $("notificationTrigger").setAttribute("aria-expanded", "false");
        state.closeTimer = window.setTimeout(() => { panel.hidden = true; }, 230);
        renderBadge();
        if (focus) $("notificationTrigger").focus();
    }

    function togglePanel() {
        if (state.open) closePanel();
        else openPanel();
    }

    async function resolveUser() {
        try {
            const response = await fetch(`${window.KeroroDashboardConfig.apiBase}/session`, {credentials: "same-origin", cache: "no-store"});
            if (!response.ok) return;
            const session = await response.json();
            if (session?.user) {
                state.user = String(session.user).replace(/[^a-zA-Z0-9_.@-]/g, "_").slice(0, 80);
                loadSeen();
                renderPanel();
            }
        } catch (_) {
            // Keep the local fallback identity when the session endpoint is unavailable.
        }
    }

    function init() {
        if (state.ready) return;
        state.ready = true;
        loadSeen();
        $("notificationTrigger").addEventListener("click", togglePanel);
        $("notificationClose").addEventListener("click", () => closePanel({focus: true}));
        document.addEventListener("click", event => {
            if (state.open && !$("notificationCenter").contains(event.target)) closePanel();
        });
        document.addEventListener("keydown", event => {
            if (state.open && event.key === "Escape") closePanel({focus: true});
        });
        renderPanel();
        resolveUser();
        if (typeof dataCache !== "undefined" && dataCache) {
            update(dataCache.events, {
                language: typeof language === "string" ? language : "th",
                force: true,
            });
        }
    }

    function update(events, options = {}) {
        state.language = options.language === "en" ? "en" : "th";
        const next = latestUnique(events);
        const signature = next.map(eventKey).join("|");
        state.items = next;
        if (state.open) {
            for (const item of next) state.seen.add(eventKey(item));
            saveSeen();
        }
        if (signature !== state.lastSignature || options.force || state.open) {
            state.lastSignature = signature;
            renderPanel();
        } else {
            renderBadge();
        }
    }

    window.dashboardNotifications = Object.freeze({update});
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, {once: true});
    else init();
})();

/* Source: scripts/pages/enforcement.js */
/* Dashboard IP enforcement. All mutations go through the authenticated API. */
(() => {
    "use strict";
    const byId = id => document.getElementById(id);
    const config = window.KeroroDashboardConfig;
    const api = config.apiBase;
    const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"})[ch]);
    const words = {
        th: {
            title: "การบล็อก IP", intro: "ตรวจสอบ IP ที่ถูกบล็อกและปลดบล็อกพร้อมบันทึกเหตุผล",
            permanent: "บล็อกถาวร", cooldown: "พักการเข้าถึง", unblockedCount: "ถูกปลดบล็อก", pending: "รอดำเนินการ/ผิดพลาด",
            search: "ค้นหา IP", status: "สถานะ", refresh: "รีเฟรช", active: "กำลังบล็อก",
            history: "ประวัติการปลดบล็อก", ip: "IP", reason: "สาเหตุ", time: "เริ่มบล็อก",
            expiry: "สิ้นสุด", action: "จัดการ", review: "ดูรายละเอียด", previous: "ก่อนหน้า", next: "ถัดไป",
            noBlocks: "ไม่พบ IP ในสถานะนี้", loadError: "โหลดข้อมูลการบล็อกไม่สำเร็จ", refreshDone: "อัปเดตสถานะการบล็อกเรียบร้อยแล้ว", refreshTitle: "รีเฟรชสำเร็จ", errorTitle: "ดำเนินการไม่สำเร็จ", waitTitle: "กำลังดำเนินการ", waitMessage: "กรุณารอสักครู่ก่อนดำเนินการอีกครั้ง",
            failed: "ซิงก์ผิดพลาด", applied: "บังคับใช้แล้ว", syncPending: "รอซิงก์", unblocked: "ปลดบล็อกแล้ว",
            permanentExpiry: "ไม่หมดอายุ", detail: "รายละเอียด IP", firstSeen: "พบครั้งแรก", lastSeen: "พบล่าสุด",
            policy: "รุ่นนโยบาย", evidence: "หลักฐาน", audit: "ประวัติการจัดการ", actor: "ผู้ดำเนินการ",
            confirm: "พิมพ์ IP เพื่อยืนยัน", unblockReason: "เหตุผลการปลดบล็อก (อย่างน้อย 8 ตัวอักษร)",
            unblock: "ยืนยันการปลดบล็อก", invalid: "โปรดพิมพ์ IP ให้ตรงและระบุเหตุผลอย่างน้อย 8 ตัวอักษร",
            requested: "รับคำขอปลดบล็อกแล้ว กำลังยืนยันผลที่ firewall", done: "ปลดบล็อกสำเร็จและตรวจสอบ firewall แล้ว",
            actionError: "ดำเนินการไม่สำเร็จ โปรดรีเฟรชสถานะ", page: "รายการ",
            sortBy: "เรียงตาม", rowsPerPage: "แสดงต่อหน้า", sortNewest: "ล่าสุดก่อน", sortOldest: "เก่าสุดก่อน", sortBlockStatus: "สถานะบล็อกก่อน", sortIp: "หมายเลข IP",
            otpStepLabel: "ขั้นตอนสุดท้าย · ยืนยันทางอีเมล", otpTitle: "ยืนยันรหัสก่อนปลดบล็อก",
            otpDescription: "กรอกรหัส 6 หลักที่ส่งไปยังอีเมลผู้ดูแล", otpIpLabel: "IP ที่จะปลดบล็อก",
            otpCodeLabel: "รหัสยืนยัน 6 หลัก", otpResend: "ส่งรหัสอีกครั้ง", otpBack: "ย้อนกลับ", otpConfirm: "ยืนยันและปลดบล็อก",
            otpSending: "กำลังส่งรหัสยืนยัน...", otpSent: "ส่งรหัสไปที่ ke••••••team@gmail.com แล้ว", otpSendError: "ส่งอีเมลไม่สำเร็จ ลองส่งอีกครั้ง",
            otpWait: "ส่งอีกครั้งได้ใน {seconds} วินาที", otpReady: "ส่งรหัสอีกครั้ง", otpExpires: "รหัสหมดอายุใน {minutes}:{seconds}", otpExpired: "รหัสหมดอายุแล้ว กรุณาขอรหัสใหม่",
            otpInvalid: "กรอกรหัสตัวเลข 6 หลัก", otpChecking: "กำลังตรวจสอบรหัส...", otpWrong: "รหัสไม่ถูกต้อง ลองกรอกอีกครั้ง", otpAttempts: "เหลือ {count} ครั้ง",
            otpStale: "ข้อมูลการบล็อกเปลี่ยนไป กรุณาเปิดรายการใหม่", otpLimit: "ขอรหัสบ่อยเกินไป กรุณารอสักครู่",
        },
        en: {
            title: "IP Enforcement", intro: "Review blocked IPs and unblock with an audited reason",
            permanent: "Permanent blocks", cooldown: "Cooldowns", unblockedCount: "Unblocked", pending: "Pending / failed",
            search: "Search IP", status: "Status", refresh: "Refresh", active: "Active blocks",
            history: "Unblock history", ip: "IP", reason: "Reason", time: "Blocked at",
            expiry: "Expires", action: "Action", review: "Review", previous: "Previous", next: "Next",
            noBlocks: "No IPs in this state", loadError: "Could not load enforcement state", refreshDone: "Block status is up to date", refreshTitle: "Refresh complete", errorTitle: "Action failed", waitTitle: "Action in progress", waitMessage: "Please wait before trying again",
            failed: "Sync failed", applied: "Applied", syncPending: "Sync pending", unblocked: "Unblocked",
            permanentExpiry: "Never", detail: "IP details", firstSeen: "First seen", lastSeen: "Last seen",
            policy: "Policy version", evidence: "Evidence", audit: "Action history", actor: "Actor",
            confirm: "Type the IP to confirm", unblockReason: "Unblock reason (at least 8 characters)",
            unblock: "Confirm unblock", invalid: "Type the exact IP and give a reason of at least 8 characters",
            requested: "Unblock requested. Waiting for firewall verification", done: "Unblocked and verified in firewall",
            actionError: "Action failed; refresh the state", page: "Items",
            sortBy: "Sort by", rowsPerPage: "Rows", sortNewest: "Newest first", sortOldest: "Oldest first", sortBlockStatus: "Block status first", sortIp: "IP address",
            otpStepLabel: "Final step · Email verification", otpTitle: "Verify before unblocking",
            otpDescription: "Enter the six-digit code sent to the administrator email", otpIpLabel: "IP to unblock",
            otpCodeLabel: "Six-digit verification code", otpResend: "Resend code", otpBack: "Back", otpConfirm: "Verify and unblock",
            otpSending: "Sending verification code...", otpSent: "Code sent to ke••••••team@gmail.com", otpSendError: "Could not send email. Please try again",
            otpWait: "Resend in {seconds}s", otpReady: "Resend code", otpExpires: "Code expires in {minutes}:{seconds}", otpExpired: "Code expired. Request a new one",
            otpInvalid: "Enter a six-digit code", otpChecking: "Verifying code...", otpWrong: "Incorrect code. Please try again", otpAttempts: "{count} attempts left",
            otpStale: "Block state changed. Open the entry again", otpLimit: "Too many code requests. Please wait",
        }
    };
    const lang = () => (typeof language !== "undefined" && language === "en") ? "en" : "th";
    const tr = key => words[lang()][key] || key;
    const state = {cursor: 0, next: null, limit: 10, total: 0, loading: false, session: null, selected: null, searchTimer: null,
        otp: null, otpBusy: false, otpTicker: null};
    const fill = (key, values) => tr(key).replace(/\{(\w+)\}/g, (_, name) => String(values[name] ?? ""));
    const notify = (type, title, value, key) => window.dashboardNotify?.show({type, title, message: value, key});
    const waitLockedAction = key => window.dashboardNotify?.actions?.wait(key, {title: tr("waitTitle"), message: tr("waitMessage")});
    const beginAction = key => window.dashboardNotify?.actions?.begin(key) ?? true;
    const finishAction = (key, type, title, value) => window.dashboardNotify?.actions?.finish(key, {type, title, message: value});

    function formatTime(value) {
        if (!value) return "—";
        const date = new Date(value);
        return Number.isNaN(date.valueOf()) ? "—" : date.toLocaleString(lang() === "th" ? "th-TH" : "en-US");
    }
    function statusLabel(item) {
        if (item.enforcement_status === "FAILED") return [tr("failed"), "failed"];
        if (item.desired_status === "UNBLOCK_PENDING" || item.enforcement_status === "PENDING") return [tr("syncPending"), "pending"];
        if (item.desired_status === "PERMANENT_BLOCK") return [tr("permanent"), "permanent"];
        if (item.desired_status === "COOLDOWN") return [tr("cooldown"), "cooldown"];
        return [tr("unblocked"), "unblocked"];
    }
    function message(value, error = false) {
        if (value) notify(error ? "error" : "success", error ? tr("errorTitle") : tr("refreshTitle"), value, "enforcement-action");
    }
    async function getJSON(url, options = {}) {
        const response = await fetch(url, {credentials: "same-origin", cache: "no-store", ...options});
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            const error = new Error(data.error || `HTTP ${response.status}`);
            error.status = response.status;
            error.data = data;
            throw error;
        }
        return data;
    }
    function pageNumbers(current, total) {
        if (total <= 7) return Array.from({length: total}, (_, index) => index + 1);
        const pages = [1];
        const start = Math.max(2, current - 1);
        const end = Math.min(total - 1, current + 1);
        if (start > 2) pages.push("…");
        for (let page = start; page <= end; page++) pages.push(page);
        if (end < total - 1) pages.push("…");
        pages.push(total);
        return pages;
    }
    function renderPagination() {
        const totalPages = Math.max(1, Math.ceil(state.total / state.limit));
        const current = Math.min(totalPages, Math.floor(state.cursor / state.limit) + 1);
        const first = state.total ? state.cursor + 1 : 0;
        const last = Math.min(state.cursor + state.limit, state.total);
        byId("blockPageSummary").textContent = `${tr("page")} ${first}–${last} / ${state.total}`;
        const controls = [
            `<button class="page-btn" type="button" data-page-action="prev" ${current === 1 ? "disabled" : ""}>${escapeHtml(tr("previous"))}</button>`,
            ...pageNumbers(current, totalPages).map(page => page === "…"
                ? `<span class="page-ellipsis">…</span>`
                : `<button class="page-btn ${page === current ? "active" : ""}" type="button" data-page="${page}" ${page === current ? "aria-current=\"page\"" : ""}>${page}</button>`),
            `<button class="page-btn" type="button" data-page-action="next" ${current === totalPages || state.next === null ? "disabled" : ""}>${escapeHtml(tr("next"))}</button>`,
        ];
        byId("blockPaginationButtons").innerHTML = controls.join("");
    }
    async function loadSummary() {
        try {
            const data = await getJSON(config.blocksSummaryUrl);
            byId("permanentBlockCount").textContent = data.permanent ?? 0;
            byId("cooldownBlockCount").textContent = data.cooldown ?? 0;
            byId("unblockedCount").textContent = data.unblocked ?? 0;
        } catch (_) { /* list error is surfaced separately */ }
        const storage = typeof dataCache !== "undefined" ? dataCache?.storage : null;
        byId("storageNotice").hidden = !storage?.warning;
        if (storage?.warning) byId("storageNotice").textContent = lang() === "th"
            ? `พื้นที่เก็บ log ใช้ไป ${storage.used_percent}% (${storage.warning}) — โปรดตรวจสอบการสำรองและพื้นที่ดิสก์`
            : `Log storage is ${storage.used_percent}% full (${storage.warning}) — check archive and disk capacity`;
    }
    function applyText() {
        const mapping = {
            enforcementTitle: "title", enforcementIntro: "intro", permanentBlockLabel: "permanent",
            cooldownBlockLabel: "cooldown", unblockedLabel: "unblockedCount", blockSearchLabel: "search",
            blockFilterLabel: "status", blockRefresh: "refresh", blockThIp: "ip", blockThStatus: "status",
            blockThReason: "reason", blockThTime: "time", blockThExpiry: "expiry", blockThAction: "action",
            blockSortLabel: "sortBy", blockPageSizeLabel: "rowsPerPage",
            confirmIpLabel: "confirm",
            unblockReasonLabel: "unblockReason", unblockSubmit: "unblock",
            otpStepLabel: "otpStepLabel", otpTitle: "otpTitle", otpDescription: "otpDescription",
            otpIpLabel: "otpIpLabel", otpCodeLabel: "otpCodeLabel", otpBack: "otpBack", otpConfirm: "otpConfirm",
        };
        for (const [id, key] of Object.entries(mapping)) byId(id).textContent = tr(key);
        const select = byId("blockFilter");
        for (const option of select.options) option.textContent = tr(({active:"active",PERMANENT_BLOCK:"permanent",COOLDOWN:"cooldown",history:"history"})[option.value]);
        const sort = byId("blockSort");
        for (const option of sort.options) option.textContent = tr(({newest:"sortNewest",oldest:"sortOldest",status:"sortBlockStatus",ip:"sortIp"})[option.value]);
        updateOtpTimer();
    }
    function renderList(data) {
        const body = byId("blockRows");
        if (!data.items.length) {
            body.innerHTML = `<tr><td colspan="6">${escapeHtml(tr("noBlocks"))}</td></tr>`;
        } else {
            body.innerHTML = data.items.map(item => {
                const [label, className] = statusLabel(item);
                const expiry = item.desired_status === "PERMANENT_BLOCK" ? tr("permanentExpiry") : formatTime(item.expires_at);
                return `<tr><td><code>${escapeHtml(item.ip)}</code></td>
                    <td><span class="enforcement-badge ${className}">${escapeHtml(label)}</span></td>
                    <td>${escapeHtml((item.reason_codes || []).join(", "))}</td>
                    <td><time title="${escapeHtml(item.created_at || "")}">${escapeHtml(formatTime(item.created_at))}</time></td>
                    <td><time title="${escapeHtml(item.expires_at || "")}">${escapeHtml(expiry)}</time></td>
                    <td><button class="enforcement-view" type="button" data-ip="${escapeHtml(item.ip)}">${escapeHtml(tr("review"))}</button></td></tr>`;
            }).join("");
        }
        state.total = data.total;
        state.next = data.next_cursor;
        renderPagination();
    }
    async function loadList(quiet = false, feedback = false) {
        if (state.loading) { if (feedback) waitLockedAction("block-refresh"); return; }
        if (feedback && !beginAction("block-refresh")) { waitLockedAction("block-refresh"); return; }
        state.loading = true;
        const refreshButton = byId("blockRefresh");
        if (feedback) window.dashboardButtonBusy?.(refreshButton, true);
        try {
            const params = new URLSearchParams({status: byId("blockFilter").value, search: byId("blockSearch").value.trim(), sort: byId("blockSort").value, cursor: state.cursor, limit: state.limit});
            const data = await getJSON(`${api}/blocks?${params}`);
            renderList(data);
            if (feedback) finishAction("block-refresh", "success", tr("refreshTitle"), tr("refreshDone"));
        } catch (error) {
            if (feedback) finishAction("block-refresh", "error", tr("errorTitle"), `${tr("loadError")}: ${error.message}`);
            else notify("error", tr("errorTitle"), `${tr("loadError")}: ${error.message}`, "block-refresh");
        } finally {
            state.loading = false;
            if (feedback) window.dashboardButtonBusy?.(refreshButton, false);
        }
        await loadSummary();
    }
    async function session() {
        try { state.session = await getJSON(`${api}/session`); }
        catch (_) { state.session = {can_unblock: false}; }
    }
    async function openDetail(ip) {
        try {
            const data = await getJSON(`${api}/blocks/${encodeURIComponent(ip)}`);
            const item = data.block;
            state.selected = item;
            const [label] = statusLabel(item);
            byId("blockDialogTitle").textContent = `${tr("detail")}: ${ip}`;
            const fields = [
                [tr("status"), `${label} / ${item.enforcement_status}`],
                [tr("reason"), (item.reason_codes || []).join(", ")],
                [tr("firstSeen"), formatTime(item.first_seen_at)],
                [tr("lastSeen"), formatTime(item.last_seen_at)],
                [tr("time"), formatTime(item.created_at)],
                [tr("expiry"), item.expires_at ? formatTime(item.expires_at) : tr("permanentExpiry")],
                [tr("policy"), item.policy_version || "—"],
                [tr("evidence"), (item.evidence_event_ids || []).join(", ") || "—"],
            ];
            const history = (data.history || []).map(action => `<p><time title="${escapeHtml(action.timestamp)}">${escapeHtml(formatTime(action.timestamp))}</time> · ${escapeHtml(action.action)} · ${escapeHtml(action.actor)} · ${escapeHtml(action.reason)}</p>`).join("");
            byId("blockDetailBody").innerHTML = `<dl class="block-detail-grid">${fields.map(([key, value]) => `<dt>${escapeHtml(key)}</dt><dd>${escapeHtml(value)}</dd>`).join("")}</dl><div class="block-history"><strong>${escapeHtml(tr("audit"))}</strong>${history}</div>`;
            const form = byId("unblockForm");
            form.hidden = !(data.can_unblock && ["PERMANENT_BLOCK", "COOLDOWN"].includes(item.desired_status));
            byId("confirmBlockIp").value = "";
            byId("unblockReason").value = "";
            byId("unblockError").textContent = "";
            byId("blockReviewStep").hidden = false;
            byId("blockOtpStep").hidden = true;
            byId("blockDetailDialog").setAttribute("aria-labelledby", "blockDialogTitle");
            byId("blockDetailDialog").showModal();
        } catch (error) { message(`${tr("loadError")}: ${error.message}`, true); }
    }
    async function waitAction(actionId) {
        for (let attempt = 0; attempt < 12; attempt++) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const result = await getJSON(`${api}/actions/${actionId}`);
            if (result.block?.desired_status === "UNBLOCKED" && result.block?.enforcement_status === "APPLIED") return true;
            if (result.block?.enforcement_status === "FAILED") return false;
        }
        return false;
    }
    function updateOtpTimer() {
        const otp = state.otp;
        if (!otp) return;
        const now = Date.now() / 1000;
        const remaining = Math.max(0, Math.ceil((otp.expiresAt || 0) - now));
        const wait = Math.max(0, Math.ceil((otp.resendAt || 0) - now));
        byId("otpExpiry").textContent = otp.challengeId
            ? (remaining ? fill("otpExpires", {minutes: Math.floor(remaining / 60), seconds: String(remaining % 60).padStart(2, "0")}) : tr("otpExpired"))
            : "";
        byId("otpResend").textContent = wait ? fill("otpWait", {seconds: wait}) : tr("otpReady");
        byId("otpResend").disabled = state.otpBusy || wait > 0;
        const confirmButton = byId("otpConfirm");
        confirmButton.disabled = !otp.challengeId || !remaining || otp.attemptsRemaining === 0 || !/^[0-9]{6}$/.test(byId("blockOtpCode").value);
        confirmButton.classList.toggle("ui-action-busy", state.otpBusy);
        confirmButton.setAttribute("aria-busy", String(state.otpBusy));
    }
    function showOtpStep() {
        byId("blockReviewStep").hidden = true;
        byId("blockOtpStep").hidden = false;
        byId("blockDetailDialog").setAttribute("aria-labelledby", "otpTitle");
        byId("otpTargetIp").textContent = state.otp.ip;
        byId("blockOtpCode").value = "";
        byId("otpError").textContent = "";
        byId("otpDeliveryStatus").textContent = tr("otpSending");
        byId("otpDeliveryStatus").dataset.state = "sending";
        clearInterval(state.otpTicker);
        state.otpTicker = setInterval(updateOtpTimer, 1000);
        updateOtpTimer();
        byId("blockOtpCode").focus({preventScroll: true});
    }
    function showReviewStep() {
        byId("blockOtpStep").hidden = true;
        byId("blockReviewStep").hidden = false;
        byId("blockDetailDialog").setAttribute("aria-labelledby", "blockDialogTitle");
        byId("unblockSubmit").focus();
    }
    async function requestOtp() {
        if (!state.otp || state.otpBusy) return;
        const otp = state.otp;
        const resend = Boolean(otp.challengeId);
        state.otpBusy = true;
        byId("otpError").textContent = "";
        byId("otpDeliveryStatus").textContent = tr("otpSending");
        byId("otpDeliveryStatus").dataset.state = "sending";
        updateOtpTimer();
        try {
            await session();
            const path = resend ? "otp/resend" : "otp/start";
            const body = resend ? {challenge_id: otp.challengeId} : {
                confirm_ip: otp.ip, reason: otp.reason, expected_version: otp.version,
            };
            const result = await getJSON(`${api}/blocks/${encodeURIComponent(otp.ip)}/${path}`, {
                method: "POST", headers: {"Content-Type": "application/json", "X-CSRF-Token": state.session.csrf_token || ""},
                body: JSON.stringify(body),
            });
            if (state.otp !== otp) return;
            otp.challengeId = result.challenge_id;
            otp.expiresAt = Number(result.expires_at);
            otp.resendAt = Number(result.resend_at);
            otp.attemptsRemaining = 5;
            byId("otpDeliveryStatus").textContent = tr("otpSent");
            byId("otpDeliveryStatus").dataset.state = "sent";
            byId("blockOtpCode").focus();
        } catch (error) {
            if (state.otp !== otp) return;
            if (error.data?.resend_at) otp.resendAt = Number(error.data.resend_at);
            if (error.status === 503) {
                otp.challengeId = null;
                otp.expiresAt = 0;
                otp.resendAt = 0;
            }
            byId("otpDeliveryStatus").textContent = "";
            byId("otpDeliveryStatus").dataset.state = "error";
            byId("otpError").textContent = error.status === 429 ? tr("otpLimit")
                : error.status === 409 ? tr("otpStale") : tr("otpSendError");
        } finally {
            if (state.otp === otp) {
                state.otpBusy = false;
                updateOtpTimer();
            }
        }
    }
    async function submitUnblock() {
        const item = state.selected;
        const ip = byId("confirmBlockIp").value.trim();
        const reason = byId("unblockReason").value.trim();
        if (!item || ip !== item.ip || reason.length < 8 || reason.length > 500) {
            byId("unblockError").textContent = tr("invalid"); return;
        }
        byId("unblockError").textContent = "";
        state.otp = {ip, reason, version: item.version, challengeId: null, expiresAt: 0, resendAt: 0, attemptsRemaining: 5};
        showOtpStep();
        await requestOtp();
    }
    async function verifyOtp() {
        const otp = state.otp;
        const code = byId("blockOtpCode").value.trim();
        if (!otp) return;
        if (state.otpBusy || !beginAction("otp-unblock")) { waitLockedAction("otp-unblock"); return; }
        if (!/^[0-9]{6}$/.test(code)) {
            window.dashboardNotify?.actions?.release("otp-unblock");
            byId("otpError").textContent = tr("otpInvalid");
            byId("blockOtpCode").focus();
            return;
        }
        state.otpBusy = true;
        byId("otpError").textContent = "";
        byId("otpDeliveryStatus").textContent = tr("otpChecking");
        byId("otpDeliveryStatus").dataset.state = "sending";
        updateOtpTimer();
        try {
            await session();
            const action = await getJSON(`${api}/blocks/${encodeURIComponent(otp.ip)}/unblock`, {
                method: "POST", headers: {"Content-Type":"application/json", "X-CSRF-Token": state.session.csrf_token || ""},
                body: JSON.stringify({challenge_id: otp.challengeId, code, expected_version: otp.version}),
            });
            byId("blockDetailDialog").close();
            await loadList(true);
            const success = await waitAction(action.action_id);
            await loadList(true);
            finishAction("otp-unblock", success ? "success" : "error", success ? tr("done") : tr("errorTitle"), success ? tr("done") : tr("actionError"));
        } catch (error) {
            if (state.otp !== otp) { window.dashboardNotify?.actions?.release("otp-unblock"); return; }
            if (error.status === 422) {
                otp.attemptsRemaining = Number(error.data?.attempts_remaining ?? 0);
                byId("otpError").textContent = `${tr("otpWrong")} · ${fill("otpAttempts", {count: otp.attemptsRemaining})}`;
                finishAction("otp-unblock", "error", tr("errorTitle"), tr("otpWrong"));
                byId("blockOtpCode").value = "";
                byId("blockOtpCode").focus();
            } else {
                if (error.status === 410) otp.expiresAt = 0;
                byId("otpError").textContent = error.status === 410 ? tr("otpExpired")
                    : error.status === 409 ? tr("otpStale") : `${tr("actionError")}: ${error.message}`;
                finishAction("otp-unblock", "error", tr("errorTitle"), byId("otpError").textContent);
            }
            byId("otpDeliveryStatus").textContent = tr("otpSent");
            byId("otpDeliveryStatus").dataset.state = "sent";
        } finally {
            if (state.otp === otp) {
                state.otpBusy = false;
                updateOtpTimer();
            }
        }
    }
    byId("blockFilter").addEventListener("change", () => {state.cursor = 0; loadList();});
    byId("blockSort").addEventListener("change", () => {state.cursor = 0; loadList();});
    byId("blockPageSize").addEventListener("change", event => {
        state.limit = Number(event.target.value);
        state.cursor = 0;
        loadList();
    });
    byId("blockSearch").addEventListener("input", () => {
        clearTimeout(state.searchTimer);
        state.searchTimer = setTimeout(() => {state.cursor = 0; loadList();}, 300);
    });
    byId("blockRefresh").addEventListener("click", () => loadList(true, true));
    byId("blockPaginationButtons").addEventListener("click", event => {
        const button = event.target.closest("button[data-page-action], button[data-page]");
        if (!button || button.disabled) return;
        if (button.dataset.pageAction === "prev") state.cursor = Math.max(0, state.cursor - state.limit);
        else if (button.dataset.pageAction === "next") state.cursor += state.limit;
        else state.cursor = (Number(button.dataset.page) - 1) * state.limit;
        loadList();
    });
    byId("blockRows").addEventListener("click", event => {
        const button = event.target.closest("button[data-ip]");
        if (button) openDetail(button.dataset.ip);
    });
    byId("unblockSubmit").addEventListener("click", submitUnblock);
    byId("blockOtpCode").addEventListener("input", event => {
        event.target.value = event.target.value.replace(/\D/g, "").slice(0, 6);
        byId("otpError").textContent = "";
        updateOtpTimer();
    });
    byId("blockOtpCode").addEventListener("keydown", event => {
        if (event.key === "Enter") { event.preventDefault(); verifyOtp(); }
    });
    byId("otpConfirm").addEventListener("click", verifyOtp);
    byId("otpResend").addEventListener("click", requestOtp);
    byId("otpBack").addEventListener("click", showReviewStep);
    byId("blockDetailDialog").querySelector(".block-dialog-close").addEventListener("click", () => byId("blockDetailDialog").close());
    byId("blockDetailDialog").querySelector("form").addEventListener("submit", event => event.preventDefault());
    byId("blockDetailDialog").addEventListener("close", () => {
        clearInterval(state.otpTicker);
        state.otpTicker = null;
        state.otp = null;
        state.otpBusy = false;
        byId("blockOtpCode").value = "";
    });
    for (const id of ["thBtn", "enBtn"]) byId(id).addEventListener("click", () => setTimeout(() => {applyText(); loadList(true);}, 0));
    applyText();
    session();
    loadList();
    setInterval(() => {if (!document.hidden && !byId("blockDetailDialog").open) loadList(true);}, config.enforcementRefreshMs);
})();

/* Source: scripts/pages/history.js */
(() => {
    "use strict";
    const $ = id => document.getElementById(id);
    const api = window.KeroroDashboardConfig.apiBase;
    const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"})[ch]);
    const labels = {
        th: {title:"ค้นหาประวัติเหตุการณ์", intro:"เลือกช่วงวันเพื่อดูเหตุการณ์ที่เก็บไว้ตั้งแต่เริ่มบันทึก", from:"จากวันที่", to:"ถึงวันที่", search:"ค้นหา IP หรือสาเหตุ", submit:"ค้นหา", time:"เวลา", window:"ช่วงวิเคราะห์", reason:"สาเหตุ", severity:"ความเสี่ยง", prev:"ก่อนหน้า", next:"ถัดไป", initial:"เลือกช่วงวันแล้วกดค้นหา", empty:"ไม่พบเหตุการณ์ในช่วงนี้", error:"ค้นหาไม่สำเร็จ", range:"เลือกได้ครั้งละไม่เกิน 31 วัน", page:"รายการ", searchTitle:"ค้นหาสำเร็จ", searchDone:"พบข้อมูล {count} รายการ", errorTitle:"ดำเนินการไม่สำเร็จ", waitTitle:"กำลังดำเนินการ", waitMessage:"กรุณารอสักครู่ก่อนค้นหาอีกครั้ง", label:"ผลตรวจ", action:"จัดการ", review:"ตรวจสอบ", notReviewed:"ยังไม่ตรวจ", malicious:"เป็นภัยจริง", benign:"ปกติ / แจ้งเตือนผิด", labelTitle:"ตรวจสอบเหตุการณ์", labelReason:"เหตุผล (อย่างน้อย 8 ตัวอักษร)", saveLabel:"บันทึกผลตรวจสอบ", invalidLabel:"กรุณาเลือกผลและระบุเหตุผลอย่างน้อย 8 ตัวอักษร", labelSaved:"บันทึกผลตรวจสอบแล้ว"},
        en: {title:"Event history", intro:"Choose a date range to inspect retained security events", from:"From", to:"To", search:"Search IP or reason", submit:"Search", time:"Time", window:"Window", reason:"Detection", severity:"Severity", prev:"Previous", next:"Next", initial:"Choose a date range and search", empty:"No events in this range", error:"Search failed", range:"Choose at most 31 days per search", page:"Items", searchTitle:"Search complete", searchDone:"Found {count} items", errorTitle:"Action failed", waitTitle:"Action in progress", waitMessage:"Please wait before searching again", label:"Review", action:"Action", review:"Review", notReviewed:"Not reviewed", malicious:"Confirmed threat", benign:"Benign / false alert", labelTitle:"Review event", labelReason:"Reason (at least 8 characters)", saveLabel:"Save review", invalidLabel:"Choose a result and give a reason of at least 8 characters", labelSaved:"Review saved"}
    };
    const lang = () => (typeof language !== "undefined" && language === "en") ? "en" : "th";
    const t = key => labels[lang()][key];
    const fill = (key, values) => t(key).replace(/\{(\w+)\}/g, (_, name) => String(values[name] ?? ""));
    const notify = (type, title, message, key) => window.dashboardNotify?.show({type, title, message, key});
    const waitAction = key => window.dashboardNotify?.actions?.wait(key, {title:t("waitTitle"),message:t("waitMessage")});
    const beginAction = key => window.dashboardNotify?.actions?.begin(key) ?? true;
    const finishAction = (key,type,title,message) => window.dashboardNotify?.actions?.finish(key,{type,title,message});
    const state = {cursor:0, next:null, total:0, busy:false, searched:false, events:[], selected:null, labelVersion:0, session:null};
    function localDate(value) {const d=new Date(value);return Number.isNaN(d.valueOf())?"—":d.toLocaleString(lang()==="th"?"th-TH":"en-US");}
    function pageNumbers(current, total) {
        if (total <= 7) return Array.from({length: total}, (_, index) => index + 1);
        const pages = [1], start = Math.max(2, current - 1), end = Math.min(total - 1, current + 1);
        if (start > 2) pages.push("…");
        for (let page = start; page <= end; page++) pages.push(page);
        if (end < total - 1) pages.push("…");
        pages.push(total);
        return pages;
    }
    function renderPagination() {
        const limit = 20, totalPages = Math.max(1, Math.ceil(state.total / limit));
        const current = Math.min(totalPages, Math.floor(state.cursor / limit) + 1);
        const first = state.total ? state.cursor + 1 : 0, last = Math.min(state.cursor + limit, state.total);
        $("historyPageSummary").textContent = `${t("page")} ${first}–${last} / ${state.total}`;
        $("historyPaginationButtons").innerHTML = [
            `<button class="page-btn" type="button" data-page-action="prev" ${current === 1 ? "disabled" : ""}>${escapeHtml(t("prev"))}</button>`,
            ...pageNumbers(current, totalPages).map(page => page === "…" ? `<span class="page-ellipsis">…</span>` : `<button class="page-btn ${page === current ? "active" : ""}" type="button" data-page="${page}" ${page === current ? "aria-current=\"page\"" : ""}>${page}</button>`),
            `<button class="page-btn" type="button" data-page-action="next" ${current === totalPages || state.next === null ? "disabled" : ""}>${escapeHtml(t("next"))}</button>`,
        ].join("");
    }
    function applyText() {
        const ids = {historyTitle:"title",historyIntro:"intro",historyFromLabel:"from",historyToLabel:"to",historySearchLabel:"search",historySubmit:"submit",historyThTime:"time",historyThWindow:"window",historyThReason:"reason",historyThSeverity:"severity",historyThLabel:"label",historyThAction:"action",eventLabelTitle:"labelTitle",eventLabelReasonLabel:"labelReason",eventLabelSubmit:"saveLabel"};
        for (const [id,key] of Object.entries(ids)) $(id).textContent=t(key);
        $("eventLabelSelectLabel").textContent=t("label");
        $("eventLabelSelect").options[0].textContent=t("malicious");
        $("eventLabelSelect").options[1].textContent=t("benign");
        if (!state.searched) $("historyRows").innerHTML=`<tr><td colspan="7">${escapeHtml(t("initial"))}</td></tr>`;
        else renderPagination();
    }
    async function search(feedback = false) {
        if (state.busy) {if(feedback)waitAction("history-search");return;}
        const start=$("historyFrom").value, end=$("historyTo").value;
        const days=(Date.parse(end+"T00:00:00Z")-Date.parse(start+"T00:00:00Z"))/86400000;
        if (!start || !end || days<0 || days>30) {notify("error",t("errorTitle"),t("range"),"history-search");return;}
        if(feedback&&!beginAction("history-search")){waitAction("history-search");return;}
        state.busy=true;
        if (feedback) window.dashboardButtonBusy?.($("historySubmit"), true);
        try {
            const params=new URLSearchParams({from:start,to:end,search:$("historySearch").value.trim(),cursor:state.cursor,limit:20});
            const response=await fetch(`${api}/events?${params}`,{credentials:"same-origin",cache:"no-store"});
            const data=await response.json();
            if (!response.ok) throw new Error(data.error||`HTTP ${response.status}`);
            state.searched=true;state.total=data.total;state.next=data.next_cursor;state.events=data.items;
            $("historyRows").innerHTML=data.items.length?data.items.map(item=>`<tr>
                <td title="${escapeHtml(item.time||item.minute||"")}">${escapeHtml(localDate(item.time||`${item.minute}:00Z`))}</td>
                <td><code>${escapeHtml(item.ip)}</code></td><td>${escapeHtml(item.window_minutes||1)} min</td>
                <td>${escapeHtml((item.reasons||[]).join(", ")||"AI_ANOMALY")}</td>
                <td>${escapeHtml(item.severity)}</td>
                <td>${escapeHtml(item.analyst_label==="MALICIOUS"?t("malicious"):item.analyst_label==="BENIGN"?t("benign"):t("notReviewed"))}</td>
                <td><button class="enforcement-view" type="button" data-event-id="${escapeHtml(item.event_id)}">${escapeHtml(t("review"))}</button></td></tr>`).join(""):`<tr><td colspan="7">${escapeHtml(t("empty"))}</td></tr>`;
            renderPagination();
            if (feedback) finishAction("history-search","success",t("searchTitle"),fill("searchDone",{count:data.total}));
        } catch(error) {if(feedback)finishAction("history-search","error",t("errorTitle"),`${t("error")}: ${error.message}`);else notify("error",t("errorTitle"),`${t("error")}: ${error.message}`,"history-search");}
        finally {state.busy=false;if(feedback)window.dashboardButtonBusy?.($("historySubmit"),false);}
    }
    async function openReview(id) {
        const item=state.events.find(event=>event.event_id===id);
        if(!item)return;
        state.selected=item;
        $("eventLabelTitle").textContent=t("labelTitle");
        $("eventLabelDetail").textContent=`${item.ip} · ${localDate(item.time||`${item.minute}:00Z`)} · ${(item.reasons||[]).join(", ")||"AI_ANOMALY"}`;
        $("eventLabelError").textContent="";
        try {
            const [sessionResponse,labelResponse]=await Promise.all([
                fetch(`${api}/session`,{credentials:"same-origin",cache:"no-store"}),
                fetch(`${api}/events/${encodeURIComponent(id)}/label`,{credentials:"same-origin",cache:"no-store"})
            ]);
            if(!sessionResponse.ok||!labelResponse.ok)throw new Error("HTTP error");
            state.session=await sessionResponse.json();
            const labelData=await labelResponse.json();
            state.labelVersion=labelData.label?.version||0;
            $("eventLabelSelect").value=labelData.label?.label||"MALICIOUS";
            $("eventLabelReason").value="";
            $("eventLabelForm").hidden=!state.session.can_unblock;
            $("eventLabelDialog").showModal();
        } catch(error) {notify("error",t("errorTitle"),`${t("error")}: ${error.message}`,"history-review");}
    }
    async function saveReview() {
        const item=state.selected, reason=$("eventLabelReason").value.trim();
        if(!item||reason.length<8||reason.length>500){$("eventLabelError").textContent=t("invalidLabel");return;}
        const button=$("eventLabelSubmit");button.disabled=true;
        try {
            const response=await fetch(`${api}/events/${encodeURIComponent(item.event_id)}/label`,{
                method:"POST",credentials:"same-origin",
                headers:{"Content-Type":"application/json","X-CSRF-Token":state.session?.csrf_token||""},
                body:JSON.stringify({label:$("eventLabelSelect").value,reason,event_date:item.minute.slice(0,10),expected_version:state.labelVersion})
            });
            const result=await response.json();
            if(!response.ok)throw new Error(result.error||`HTTP ${response.status}`);
            $("eventLabelDialog").close();
            notify("success",t("searchTitle"),t("labelSaved"),"history-review");
            await search();
        } catch(error) {$("eventLabelError").textContent=`${t("error")}: ${error.message}`;}
        finally {button.disabled=false;}
    }
    const today=new Date();
    const dateValue=days=>{const d=new Date(today);d.setDate(d.getDate()-days);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;};
    $("historyTo").value=dateValue(0);$("historyFrom").value=dateValue(7);
    $("historySubmit").addEventListener("click",()=>{state.cursor=0;search(true);});
    $("historyPaginationButtons").addEventListener("click",event=>{
        const button=event.target.closest("button[data-page-action], button[data-page]");
        if(!button||button.disabled)return;
        if(button.dataset.pageAction==="prev")state.cursor=Math.max(0,state.cursor-20);
        else if(button.dataset.pageAction==="next")state.cursor+=20;
        else state.cursor=(Number(button.dataset.page)-1)*20;
        search();
    });
    $("historyRows").addEventListener("click",event=>{const button=event.target.closest("button[data-event-id]");if(button)openReview(button.dataset.eventId);});
    $("eventLabelSubmit").addEventListener("click",saveReview);
    for(const id of ["thBtn","enBtn"]) $(id).addEventListener("click",()=>setTimeout(applyText,0));
    applyText();
})();
