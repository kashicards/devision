document.addEventListener("DOMContentLoaded", async () => {
    const checkbox = document.getElementById("disable-js");

    try {
        const storedState = await chrome.storage.local.get('disable-js');
        const isDisabled = storedState['disable-js'] || false;

        checkbox.checked = isDisabled;

        if (isDisabled) {
            chrome.tabs.query({ active: true, currentWindow: true }, async ([tab]) => {
                if (!tab?.id) return;
                const tabId = tab.id;
                chrome.scripting.executeScript({
                    target: { tabId },
                    func: applyChanges,
                    args: [true, false, false]
                });
            });
        }
    } catch (error) {
        // Fehlerbehandlung bleibt erhalten
    }
});

// document.getElementById("disable-js").addEventListener("change", async (event) => {
//     const disableJS = event.target.checked;

//     await chrome.storage.local.set({
//         'disable-js': disableJS
//     });

//     // Änderungen auf der Seite anwenden
//     chrome.tabs.query({ active: true, currentWindow: true }, async ([tab]) => {
//         if (!tab?.id) return;

//         const tabId = tab.id;
//         const disableStyles = document.getElementById("disable-all-styles").checked;
//         const disableInlineStyles = document.getElementById("disable-inline-styles").checked;

//         chrome.scripting.executeScript({
//             target: { tabId },
//             func: applyChanges,
//             args: [disableJS, disableStyles, disableInlineStyles]
//         });
//     });
// });

document.getElementById("apply-btn").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, async ([tab]) => {
        if (!tab?.id) return;

        const tabId = tab.id;
        const disableJS = document.getElementById("disable-js").checked;
        const disableStyles = document.getElementById("disable-all-styles").checked;
        const disableInlineStyles = document.getElementById("disable-inline-styles").checked;

        await chrome.storage.local.set({
            'disable-js': disableJS,
            [`${tabId}-disable-js`]: disableJS
        });

        chrome.scripting.executeScript({
            target: { tabId },
            func: applyChanges,
            args: [disableJS, disableStyles, disableInlineStyles]
        });

        const isChecked = disableJS;
        const currentRules = await chrome.declarativeNetRequest.getDynamicRules();
        const ruleIds = currentRules.map(rule => rule.id);

        const url = new URL(tab.url);
        const domain = url.hostname;

        if (isChecked) {
            await chrome.storage.local.set({ [domain]: true });

            await chrome.declarativeNetRequest.updateDynamicRules({
                removeRuleIds: ruleIds,
                addRules: [{
                    "id": 1,
                    "priority": 1,
                    "action": { "type": "block" },
                    "condition": {
                        "resourceTypes": ["script"],
                        "domains": [domain],
                        "urlFilter": "*"
                    }
                }]
            });
        } else {
            await chrome.storage.local.remove(domain);

            await chrome.declarativeNetRequest.updateDynamicRules({
                removeRuleIds: ruleIds
            });
        }

        chrome.tabs.reload(tab.id, { bypassCache: true });
    });
});

document.getElementById("reset-btn").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, async ([tab]) => {
        if (!tab?.id) return;

        const tabId = tab.id;

        await chrome.storage.local.set({
            'disable-js': false,
            [`${tabId}-js`]: false,
            [`${tabId}-styles`]: false,
            [`${tabId}-inline-styles`]: false
        });

        document.getElementById("disable-js").checked = false;

        chrome.scripting.executeScript({
            target: { tabId },
            func: resetJSAndStyles
        });

        const url = new URL(tab.url);
        const domain = url.hostname;

        const currentRules = await chrome.declarativeNetRequest.getDynamicRules();
        const ruleIds = currentRules.map(rule => rule.id);

        await chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: ruleIds
        });

        await chrome.storage.local.remove(domain);

        chrome.tabs.reload(tab.id, { bypassCache: true });
    });
});

function applyChanges(disableJS, disableStyles, disableInlineStyles) {
    if (disableJS) {
        const scripts = document.querySelectorAll('script');
        scripts.forEach(script => {
            script.setAttribute('data-disabled', 'true');
            script.remove();
        });
    }

    if (disableStyles) {
        const linkStyles = document.querySelectorAll('link[rel="stylesheet"], style');
        linkStyles.forEach(style => {
            style.setAttribute('data-disabled', 'true');
            style.remove();
        });
    }

    if (disableInlineStyles) {
        const elementsWithStyles = document.querySelectorAll('*');
        elementsWithStyles.forEach(element => {
            if (element.style.cssText) {
                element.setAttribute('data-style', 'true');
                element.removeAttribute('style');
            }
        });
    }
}

function resetJSAndStyles() {
    const scripts = document.querySelectorAll('script[data-disabled="true"]');
    scripts.forEach(script => {
        script.removeAttribute('data-disabled');
        document.body.appendChild(script);
    });

    const linkStyles = document.querySelectorAll('link[data-disabled="true"], style[data-disabled="true"]');
    linkStyles.forEach(link => {
        link.removeAttribute('data-disabled');
        if (link.tagName === "LINK") {
            document.head.appendChild(link);
        } else {
            document.head.appendChild(link);
        }
    });

    const allElements = document.querySelectorAll('*[data-style="true"]');
    allElements.forEach(element => {
        element.removeAttribute('data-style');
    });
}
