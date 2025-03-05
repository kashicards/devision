document.getElementById("apply-btn").addEventListener("click", async () => {
    chrome.tabs.query({ active: true, currentWindow: true }, async ([tab]) => {
        if (!tab?.url) return;
        const url = new URL(tab.url);
        const domain = url.hostname;

        const disableJS = document.getElementById("disable-js")?.checked ?? false;
        const disableStyles = document.getElementById("disable-all-styles")?.checked ?? false;

        // Get current rules
        const currentRules = await chrome.declarativeNetRequest.getDynamicRules();
        const ruleIds = currentRules.map(rule => rule.id);

        let newRules = [];

        if (disableJS) {
            await chrome.storage.local.set({ [`${domain}-js`]: true });
            newRules.push({
                id: 1,
                priority: 1,
                action: { type: "block" },
                condition: {
                    resourceTypes: ["script"],
                    domains: [domain],
                    urlFilter: "*"
                }
            });
        } else {
            await chrome.storage.local.remove(`${domain}-js`);
        }

        if (disableStyles) {
            await chrome.storage.local.set({ [`${domain}-styles`]: true });
            newRules.push({
                id: 2,
                priority: 1,
                action: { type: "block" },
                condition: {
                    resourceTypes: ["stylesheet"],
                    domains: [domain],
                    urlFilter: "*"
                }
            });
        } else {
            await chrome.storage.local.remove(`${domain}-styles`);
        }

        await chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: ruleIds,
            addRules: newRules
        });

        chrome.tabs.reload(tab.id, { bypassCache: true });
    });
});

chrome.tabs.query({ active: true, currentWindow: true }, async ([tab]) => {
    if (!tab?.url) return;
    const url = new URL(tab.url);
    const domain = url.hostname;

    const result = await chrome.storage.local.get([`${domain}-js`, `${domain}-styles`]);

    const jsCheckbox = document.getElementById("disable-js");
    const stylesCheckbox = document.getElementById("disable-all-styles");

    if (jsCheckbox) jsCheckbox.checked = result[`${domain}-js`] === true;
    if (stylesCheckbox) stylesCheckbox.checked = result[`${domain}-styles`] === true;
});