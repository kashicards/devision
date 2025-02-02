function loadScript(url) {
    const script = document.createElement('script');
    script.src = url;
    script.defer = true;
    script.onload = function () {
        loadSSLStatus();
    };
    script.onerror = function () {
        // console.error("Error loading the script:", url);
    };
    document.head.appendChild(script);
}

function checkSSL() {
    return {
        secure: window.isSecureContext,
        protocol: location.protocol,
        domain: location.hostname
    };
}

function displayResult({ secure, protocol, domain }) {
    const sslContainer = document.getElementById("ssl-container");
    const sslList = document.getElementById("ssl-list");

    if (!sslContainer || !sslList) {
        return;
    }

    sslList.innerHTML = "";

    const resultDiv = document.createElement("div");
    resultDiv.className = secure && protocol === "https:" ? "secure-item" : "insecure-item";

    const paragraph = document.createElement("p");
    paragraph.innerHTML = `The connection to the domain <b>${domain}</b> is <b>${secure && protocol === "https:" ? "secure (HTTPS)" : "insecure (no HTTPS)"}</b>.`;
    resultDiv.appendChild(paragraph);

    sslList.appendChild(resultDiv);
}

function loadSSLStatus() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs || tabs.length === 0) {
            return;
        }

        const activeTab = tabs[0];

        chrome.scripting.executeScript({
            target: { tabId: activeTab.id },
            function: checkSSL
        }, (results) => {
            if (!results || !Array.isArray(results) || !results[0]?.result) {
                return;
            }

            const sslInfo = results[0].result;
            displayResult(sslInfo);
        });
    });
}
loadSSLStatus();
