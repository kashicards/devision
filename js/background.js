chrome.runtime.onInstalled.addListener(() => {
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "logData") {
        sendResponse({ status: "success" });
    }
});

chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
            // console.log("Devision Erweiterung ausgeführt");
        }
    });
});
