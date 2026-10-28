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
