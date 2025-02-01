chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed!");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "logData") {
        console.log("Logged data:", message.data);
        sendResponse({ status: "success" });
    }
});
