window.addEventListener('load', function () {
    pageSpeed();
});

function pageSpeed() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const activeTab = tabs[0];

        if (!activeTab) {
            console.error('Kein aktiver Tab gefunden.');
            return;
        }

        chrome.scripting.executeScript(
            {
                target: { tabId: activeTab.id },
                func: collectPerformanceData,
            },
            (results) => {
                if (chrome.runtime.lastError) {
                    console.error('Fehler beim Ausführen des Skripts:', chrome.runtime.lastError.message);
                    return;
                }

                if (results && results[0] && results[0].result) {
                    displayPerformanceData(activeTab.url, results[0].result);
                } else {
                    console.error('Keine Performance-Daten verfügbar.');
                    displayError('Keine Performance-Daten verfügbar.');
                }
            }
        );
    });
}

function collectPerformanceData() {
    return new Promise((resolve) => {
        const navigationEntry = performance.getEntriesByType('navigation')[0];
        const paintEntries = performance.getEntriesByType('paint');

        const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
        const fcp = fcpEntry ? fcpEntry.startTime : null;

        let lcp = null;
        const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            if (entries.length > 0 && lcp === null) {
                lcp = entries[entries.length - 1].startTime;
                lcpObserver.disconnect();
            }
        });
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

        let cls = 0;
        const clsObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            for (const entry of entries) {
                if (!entry.hadRecentInput && entry.value > 0) {
                    cls += entry.value;
                }
            }
        });
        clsObserver.observe({ type: 'layout-shift', buffered: true });

        const startTime = performance.now();
        let loadTime = null, domLoadTime = null, renderTime = null;

        const checkCompletion = setInterval(() => {
            if (lcp !== null && cls !== 0) {
                if (navigationEntry) {
                    loadTime = navigationEntry.loadEventEnd - navigationEntry.startTime;
                    domLoadTime = navigationEntry.domContentLoadedEventEnd - navigationEntry.startTime;
                    renderTime = navigationEntry.responseEnd - navigationEntry.startTime;
                }

                clearInterval(checkCompletion);

                resolve({
                    loadTime: loadTime || performance.now() - startTime,
                    domLoadTime: domLoadTime || performance.now() - startTime,
                    renderTime: renderTime || performance.now() - startTime,
                    fcp,
                    lcp,
                    cls,
                    device: window.innerWidth <= 768 ? 'Mobil' : 'Desktop',
                });
            }
        }, 100);

        setTimeout(() => {
            clearInterval(checkCompletion);
            resolve(null);
        }, 5000);
    });
}

function displayPerformanceData(url, data) {
    if (!data) {
        console.error('Keine Performance-Daten verfügbar.');
        displayError('Keine Performance-Daten verfügbar.');
        return;
    }

    const { loadTime, domLoadTime, renderTime, fcp, lcp, cls, device } = data;

    document.getElementById('url').textContent = url || 'Keine URL verfügbar';
    document.getElementById('loadTime').textContent = `${loadTime.toFixed(2)} ms`;
    document.getElementById('domLoadTime').textContent = `${domLoadTime.toFixed(2)} ms`;
    document.getElementById('renderTime').textContent = `${renderTime.toFixed(2)} ms`;
    document.getElementById('fcp').textContent = fcp ? `${fcp.toFixed(2)} ms` : 'Nicht verfügbar';
    document.getElementById('lcp').textContent = lcp ? `${lcp.toFixed(2)} ms` : 'Nicht verfügbar';
    document.getElementById('cls').textContent = cls !== null ? cls.toFixed(8) : 'Nicht verfügbar';
    document.getElementById('device').textContent = device;

    updateUIIndicators(loadTime, domLoadTime, renderTime, fcp, lcp, cls);
    updateCLSLabel(cls);
}

function updateUIIndicators(loadTime, domLoadTime, renderTime, fcp, lcp, cls) {
    const loadTimeBar = document.getElementById('loadTimeBar');
    const domLoadTimeBar = document.getElementById('domLoadTimeBar');
    const renderTimeBar = document.getElementById('renderTimeBar');
    const clsBar = document.getElementById('clsBar');

    if (loadTimeBar) {
        loadTimeBar.style.width = `${Math.min(loadTime / 1000 * 100, 100)}%`;
    }
    if (domLoadTimeBar) {
        domLoadTimeBar.style.width = `${Math.min(domLoadTime / 1000 * 100, 100)}%`;
    }
    if (renderTimeBar) {
        renderTimeBar.style.width = `${Math.min(renderTime / 1000 * 100, 100)}%`;
    }
    if (clsBar) {
        clsBar.style.width = `${Math.min(cls * 100, 100)}%`;
        clsBar.style.backgroundColor = cls > 0.25 ? 'red' : cls > 0.1 ? 'orange' : 'green';
    } else {
        console.error("Element 'clsBar' nicht gefunden");
    }
}

function updateCLSLabel(cls) {
    const clsLabel = document.getElementById('clsLabel');
    if (!clsLabel) {
        console.error("Element 'clsLabel' nicht gefunden");
        return;
    }

    if (cls > 0.25) {
        clsLabel.textContent = "Schlecht: Hohe Layoutverschiebung";
    } else if (cls > 0.1) {
        clsLabel.textContent = "Optimierbar: Moderate Verschiebung";
    } else {
        clsLabel.textContent = "Gut: Wenige oder keine Verschiebungen";
    }
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

loadPageData()