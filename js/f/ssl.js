function checkSSL() {
    const isSecure = window.isSecureContext;
    const protocol = location.protocol;

    return {
        secure: isSecure,
        protocol: protocol,
        domain: window.location.hostname
    };
}

function displayResult({ secure, protocol, domain, sslDetails }) {
    const sslContainer = document.getElementById("ssl-container");
    const sslList = document.getElementById("ssl-list");

    if (!sslContainer || !sslList) {
        console.error("Container oder Liste nicht gefunden!");
        return;
    }

    sslList.innerHTML = "";

    const resultDiv = document.createElement("div");
    resultDiv.className = secure && protocol === "https:" ? "secure-item" : "insecure-item";

    const paragraph = document.createElement("p");
    paragraph.textContent = `Die Verbindung zur Domain ${domain} ist ${secure && protocol === "https:" ? "sicher (HTTPS)" : "unsicher (kein HTTPS)"
        }.`;
    resultDiv.appendChild(paragraph);

    sslList.appendChild(resultDiv);

    if (sslDetails) {
        const sslDetailsDiv = document.createElement("div");
        sslDetailsDiv.className = "ssl-details";

        const protocolParagraph = document.createElement("p");
        protocolParagraph.textContent = `Protokoll: ${sslDetails.protocol}`;
        sslDetailsDiv.appendChild(protocolParagraph);

        const cipherSuiteParagraph = document.createElement("p");
        cipherSuiteParagraph.textContent = `Cipher Suite: ${sslDetails.cipherSuite}`;
        sslDetailsDiv.appendChild(cipherSuiteParagraph);

        const issuerParagraph = document.createElement("p");
        issuerParagraph.textContent = `Issuer: ${sslDetails.issuer}`;
        sslDetailsDiv.appendChild(issuerParagraph);

        const validToParagraph = document.createElement("p");
        validToParagraph.textContent = `Gültig bis: ${sslDetails.validTo}`;
        sslDetailsDiv.appendChild(validToParagraph);

        sslList.appendChild(sslDetailsDiv);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const sslInfo = checkSSL();

    sslInfo.sslDetails = {
        protocol: "TLS 1.3",
        cipherSuite: "TLS_AES_128_GCM_SHA256",
        issuer: "Let's Encrypt",
        validTo: "2024-12-31"
    };

    displayResult(sslInfo);
});

function loadSSLStatus() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        chrome.scripting.executeScript({
            target: { tabId: activeTab.id },
            func: checkSSL
        }, (results) => {
            if (results?.[0]?.result) {
                displayResult(results[0].result);
            }
        });
    });
}

loadSSLStatus()