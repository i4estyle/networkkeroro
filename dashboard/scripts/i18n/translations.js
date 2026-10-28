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
