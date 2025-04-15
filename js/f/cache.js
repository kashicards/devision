function updateDeleteButtonText() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length === 0 || !tabs[0].url.startsWith("http")) {
            document.getElementById("clearDataButton").textContent = "No valid domain found";
            return;
        }
        const domain = new URL(tabs[0].url).hostname;
        document.getElementById("clearDataButton").textContent = `Delete data from ${domain}`;
    });
}

function clearCookies(domain, callback) {
    chrome.cookies.getAll({ domain: domain }, (cookies) => {
        if (cookies.length === 0) {
            callback(false);
            return;
        }
        let deletedCount = 0;
        cookies.forEach((cookie) => {
            const url = `https://${cookie.domain}${cookie.path}`;
            chrome.cookies.remove({ url, name: cookie.name }, () => {
                deletedCount++;
                if (deletedCount === cookies.length) {
                    callback(true);
                }
            });
        });
    });
}

function clearCache(domain, callback) {
    chrome.browsingData.remove({
        origins: [`http://${domain}`, `https://${domain}`]
    }, {
        cache: true,
        cacheStorage: true,
        cookies: true,
        localStorage: true,
        indexedDB: true,
        fileSystems: true,
        pluginData: true
    }, () => {
        callback(true);
    });
}

function checkDeletionStatus(domain) {
    const statusElement = document.getElementById("status");

    chrome.cookies.getAll({ domain: domain }, (cookies) => {
        if (cookies.length === 0) {
            statusElement.textContent = `All cookies from ${domain} have been deleted.`;
        } else {
            statusElement.textContent = `Some cookies from ${domain} could not be deleted.`;
        }
    });

    chrome.browsingData.removeCache({}, () => {
        statusElement.textContent += " Cache cleared.";
    });
}

function handleDataDeletion() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length === 0 || !tabs[0].url.startsWith("http")) {
            document.getElementById("status").textContent = "No valid domain found.";
            return;
        }

        const domain = new URL(tabs[0].url).hostname;
        const deleteCookies = document.getElementById("deleteCookies").checked;
        const deleteCache = document.getElementById("deleteCache").checked;
        const statusElement = document.getElementById("status");

        if (!deleteCookies && !deleteCache) {
            statusElement.textContent = "No selection made. Please choose what to delete.";
            return;
        }

        let tasks = [];

        if (deleteCookies) {
            tasks.push(new Promise((resolve) => {
                clearCookies(domain, (success) => {
                    resolve(success ? `Cookies from ${domain} have been deleted.` : `No cookies found for ${domain}.`);
                });
            }));
        }

        if (deleteCache) {
            tasks.push(new Promise((resolve) => {
                clearCache(domain, () => {
                    resolve(`Cache from ${domain} has been deleted.`);
                });
            }));
        }

        Promise.all(tasks).then((messages) => {
            statusElement.textContent = messages.join(' ');
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    updateDeleteButtonText();
    document.getElementById("clearDataButton").addEventListener("click", handleDataDeletion);
});
