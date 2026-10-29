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
