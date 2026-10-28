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
