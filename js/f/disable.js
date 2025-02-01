const disableJsCheckbox = document.getElementById("disable-js");
const disableAllStylesCheckbox = document.getElementById("disable-all-styles");
const disableBrowserDefaultStylesCheckbox = document.getElementById("disable-browser-default-styles");
const disableInlineStylesCheckbox = document.getElementById("disable-inline-styles");
const applyBtn = document.getElementById("apply-btn");

applyBtn.addEventListener("click", async function () {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (disableJsCheckbox.checked) {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: disableJavaScript
        });
    }

    if (disableAllStylesCheckbox.checked) {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: disableAllStyles
        });
    }

    if (disableInlineStylesCheckbox.checked) {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: disableInlineStyles
        });
    }
});

function disableJavaScript() {
    document.querySelectorAll("script").forEach(script => script.remove());

    const originalCreateElement = document.createElement;
    document.createElement = function (tagName) {
        if (tagName.toLowerCase() === 'script') {
            return {};
        }
        return originalCreateElement.call(this, tagName);
    };

    const originalWrite = document.write;
    document.write = function () {
        console.warn('Blocked document.write for adding scripts');
    };

    window.setTimeout = function () { };
    window.setInterval = function () { };
    window.eval = function () { };
    window.Function = function () { };

    document.querySelectorAll('*').forEach(el => {
        el.removeAttribute('style');
    });

    const originalInnerHTMLSet = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML').set;
    Object.defineProperty(Element.prototype, 'innerHTML', {
        set: function (value) {
            console.warn('Blocked innerHTML');
        }
    });

    const classListProto = Object.getPrototypeOf(Element.prototype.classList);

    Object.defineProperty(classListProto, 'add', {
        value: function () {
            console.warn('Blocked classList.add');
        }
    });

    Object.defineProperty(classListProto, 'remove', {
        value: function () {
            console.warn('Blocked classList.remove');
        }
    });

    const originalAddEventListener = Element.prototype.addEventListener;
    Element.prototype.addEventListener = function (type, listener) {
        console.warn('Blocked addEventListener');
    };

    const originalRemoveEventListener = Element.prototype.removeEventListener;
    Element.prototype.removeEventListener = function (type, listener) {
        console.warn('Blocked removeEventListener');
    };
}

function disableAllStyles() {
    document.querySelectorAll("link[rel='stylesheet'], style").forEach(el => el.remove());

    document.querySelectorAll('*').forEach(el => el.removeAttribute('style'));

    const normalizeLink = document.createElement('link');
    normalizeLink.rel = 'stylesheet';
    normalizeLink.href = '..\\..\\css\\vendor\\user-agent.css';
    document.head.appendChild(normalizeLink);
}

function disableInlineStyles() {
    document.querySelectorAll('*').forEach(el => el.removeAttribute('style'));
}
