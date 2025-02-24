document.getElementById("apply-btn").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
        if (document.getElementById("disable-js").checked) {
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                function: disableJavaScript
            });
        }
        if (document.getElementById("disable-all-styles").checked) {
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                function: disableAllStyles
            });
        }
        if (document.getElementById("disable-inline-styles").checked) {
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                function: disableInlineStyles
            });
        }
    });
});

function disableJavaScript() {
    let id = window.setTimeout(() => { }, 0);
    while (id--) {
        clearTimeout(id);
        clearInterval(id);
    }

    window.setTimeout = function () { };
    window.setInterval = function () { };

    window.fetch = function () { return Promise.reject(); };
    window.WebSocket = function () { return null; };
    window.Worker = function () { return null; };

    document.write = function () { };

    document.body.innerHTML = document.body.innerHTML;
    window.addEventListener = function () { };
    document.addEventListener = function () { };

    const observer = new MutationObserver(() => { });
    observer.observe(document, { childList: true, subtree: true });
    observer.disconnect();

    Document.prototype.createElement = new Proxy(Document.prototype.createElement, {
        apply(target, thisArg, args) {
            if (args[0].toLowerCase() === "script") {
                return document.createElement("div");
            }
            return Reflect.apply(target, thisArg, args);
        }
    });

    DOMTokenList.prototype.add = function () { };
    DOMTokenList.prototype.remove = function () { };
    DOMTokenList.prototype.toggle = function () { };

    Object.defineProperty(Element.prototype, "style", {
        set: function () { }
    });

    Element.prototype.setAttribute = new Proxy(Element.prototype.setAttribute, {
        apply(target, thisArg, args) {
            if (args[0] === "class" || args[0] === "style") {
                return;
            }
            return Reflect.apply(target, thisArg, args);
        }
    });
}

function disableAllStyles() {
    document.querySelectorAll("link[rel='stylesheet'], style").forEach(el => el.remove());

    Document.prototype.createElement = new Proxy(Document.prototype.createElement, {
        apply(target, thisArg, args) {
            if (args[0].toLowerCase() === "style") {
                return document.createElement("div");
            }
            return Reflect.apply(target, thisArg, args);
        }
    });

    CSSStyleSheet.prototype.insertRule = function () { };
    CSSStyleSheet.prototype.addRule = function () { };

    document.head.insertAdjacentHTML("beforeend", "<style>* { animation: none !important; transition: none !important; }</style>");
}

function disableInlineStyles() {
    document.querySelectorAll('*').forEach(el => el.removeAttribute('style'));
}
