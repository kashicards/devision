document.getElementById("apply-btn").addEventListener("click", handleApplyClick);
document.addEventListener("DOMContentLoaded", restoreCheckboxState);

async function handleApplyClick() {
    const tab = await getActiveTab();
    if (!tab?.url) return;

    const domain = new URL(tab.url).hostname;

    if (document.getElementById("disable-all-styles").checked) {
        executeScript(tab.id, disableAllStyles);
    }

    if (document.getElementById("disable-inline-styles").checked) {
        executeScript(tab.id, disableInlineStyles);
    }

    await handleJavaScriptBlocking(domain, tab.id);
}

async function handleJavaScriptBlocking(domain, tabId) {
    const isChecked = document.getElementById("disable-js").checked;
    const currentRules = await chrome.declarativeNetRequest.getDynamicRules();
    const ruleIds = currentRules.map(rule => rule.id);

    if (isChecked) {
        await chrome.storage.local.set({ [domain]: true });
        await updateDynamicRules(ruleIds, [{
            id: 1,
            priority: 1,
            action: { type: "block" },
            condition: { resourceTypes: ["script"], domains: [domain], urlFilter: "*" }
        }]);
    } else {
        await chrome.storage.local.remove(domain);
        await updateDynamicRules(ruleIds, []);
    }

    chrome.tabs.reload(tabId, { bypassCache: true });
}

async function restoreCheckboxState() {
    const tab = await getActiveTab();
    if (!tab?.url) return;

    const domain = new URL(tab.url).hostname;
    const result = await chrome.storage.local.get(domain);
    document.getElementById("disable-js").checked = result[domain] === true;
}

function executeScript(tabId, func) {
    chrome.scripting.executeScript({
        target: { tabId },
        function: func
    });
}

async function getActiveTab() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab;
}

async function updateDynamicRules(removeRuleIds, addRules) {
    await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds, addRules });
}

function disableAllStyles() {
    document.querySelectorAll("link[rel='stylesheet'], style").forEach(el => el.remove());

    Document.prototype.createElement = new Proxy(Document.prototype.createElement, {
        apply(target, thisArg, args) {
            return args[0].toLowerCase() === "style" ? document.createElement("div") : Reflect.apply(target, thisArg, args);
        }
    });

    CSSStyleSheet.prototype.insertRule = () => { };
    CSSStyleSheet.prototype.addRule = () => { };

    document.head.insertAdjacentHTML("beforeend", "<style>* { animation: none !important; transition: none !important; }</style>");
}

function disableInlineStyles() {
    document.querySelectorAll('*').forEach(el => el.removeAttribute('style'));
}