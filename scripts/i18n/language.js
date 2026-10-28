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
