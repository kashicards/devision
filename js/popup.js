function loadScript(scriptPath) {
    if (!document.querySelector(`script[src="${scriptPath}"]`)) {
        const script = document.createElement('script');
        script.src = scriptPath;
        script.type = 'text/javascript';
        script.async = true;

        document.head.appendChild(script);

        // script.onload = function () {
        //     console.log(`${scriptPath} wurde erfolgreich geladen.`);
        // };

        script.onerror = function () {
            // console.error(`Fehler beim Laden des Skripts: ${scriptPath}`);
        };
    }
    // else {
    //     console.log(`Das Skript ${scriptPath} wurde bereits geladen.`);
    // }
}
function clickListener(selector, callback) {
    document.querySelectorAll(selector)?.forEach(element => element.addEventListener('click', callback));
}




function initializeEventListeners() {

    document.getElementById("clearDataButton")?.addEventListener("click", handleDataDeletion);

    clickListener('.nav-item', handleNavItemClick);
    clickListener('.sub-menu-item', handleSubMenuItemClick);
    clickListener('.close-button', closeOverlay);
    clickListener('.close-button', closeOverlay);

    clickListener('#password-menu-item', function () {
        loadScript('js/f/generate-pw.js');
    });
    clickListener('#color-menu-item', function () {
        loadScript('js/f/color-picker.js');
    });
    clickListener('#font-menu-item', function () {
        loadScript('js/f/font-picker.js');
    });
    clickListener('#meta-menu-item', function () {
        loadScript('js/f/meta-data.js');
    });
    clickListener('#headings-menu-item', function () {
        loadScript('js/f/headings.js');
    });
    clickListener('#images-menu-item', function () {
        loadScript('js/f/images.js');
    });
    clickListener('#links-menu-item', function () {
        loadScript('js/f/links.js');
    });
    clickListener('#fill-menu-item', function () {
        loadScript('js/f/auto-fill.js');
    });
    clickListener('#schmea-menu-item', function () {
        loadScript('js/f/schema.js');
    });
    // clickListener('#cache-menu-item', function () {
    //     loadScript('js/f/cache.js');
    // });
    clickListener('#ssl-menu-item', function () {
        loadScript('js/f/ssl.js');
    });
    clickListener('#disable-menu-item', function () {
        loadScript('js/f/disable.js');
    });

}

function displayAdditionalPageInfo(data) {
    displayTitleInfo(data.title);
    displayDescriptionInfo(data.description);
    displayKeywordsInfo(data.keywords);
    displayCanonicalInfo(data.canonical);
    displayRobotsInfo(data.robots);
    displayAuthorInfo(data.author);
    displayPublisherInfo(data.publisher);
    displayLanguageInfo(data.language);
    displayUrlInfo(data.url);
    displayHeadingsInfo(data.headings);
    displayLinksInfo(data.links);
    displayImageInfo(data.images);
}

function displayPageData(data) {
    if (!data) return;

    updateDOMContent("title", data.title, "Kein Titel gefunden");
    updateDOMContent("description", data.description, "Keine Beschreibung gefunden");
    updateDOMContent("keywords", data.keywords, "Keine Keywords gefunden");

    displayAdditionalPageInfo(data);
    updateDeleteButtonText();
}

document.addEventListener("DOMContentLoaded", () => {
    initializeEventListeners();
});


function extractSchemaData() {
    const schemaScripts = document.querySelectorAll('script[type="application/ld+json"]');
    return Array.from(schemaScripts).map(script => {
        try {
            return JSON.parse(script.innerText);
        } catch (e) {
            return null;
        }
    }).filter(Boolean);
}

function loadPageData() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        chrome.scripting.executeScript({
            target: { tabId: activeTab.id },
            function: extractPageData
        }, (result) => {
            if (result && result[0]) {
                displayPageData(result[0].result);
            }
        });
    });
}

// GENERALL FUNCTIONS

function updateDOMContent(elementId, content, fallback) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = content || fallback;
    }
}

function closeOverlay() {
    const overlay = this.closest('.sub-menu-overlay') || this.closest('.content-container');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

function handleNavItemClick() {
    closeAllSubMenus();
    const menuId = this.getAttribute('data-menu');
    const currentOverlay = document.getElementById(menuId);
    if (currentOverlay) {
        currentOverlay.style.display = 'block';
    }
}

function handleSubMenuItemClick() {
    closeAllSubMenus();
    const targetId = this.getAttribute('data-target');
    const targetContainer = document.getElementById(targetId);
    if (targetContainer) {
        targetContainer.style.display = 'block';
    }
}

function closeAllSubMenus() {
    document.querySelectorAll('.sub-menu-overlay')?.forEach(overlay => {
        overlay.style.display = 'none';
    });
}

document.addEventListener("DOMContentLoaded", () => {

    document.body.addEventListener("click", (event) => {
        if (event.target.classList.contains("collapser-headline")) {

            const content = event.target.nextElementSibling;

            if (content && content.classList.contains("collapser-content")) {
                content.classList.toggle('open');
            }
        }
    });
});

