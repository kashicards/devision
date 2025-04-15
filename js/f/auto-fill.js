function autofillForm() {
    const inputs = document.querySelectorAll("input");
    const textareas = document.querySelectorAll("textarea");
    const selects = document.querySelectorAll("select");

    inputs.forEach((input) => {
        if (input.type === "hidden" || input.offsetParent === null) return;

        if (input.type === "checkbox") {
            input.checked = true;
            input.dispatchEvent(new Event("change"));
            return;
        }

        switch (input.type) {
            case "text":
                input.value = `test`;
                break;
            case "email":
                input.value = `test@example.com`;
                break;
            case "tel":
                input.value = `123456789`;
                break;
            case "url":
                input.value = `https://example.com`;
                break;
            case "password":
                input.value = `password123`;
                break;
            case "number":
                input.value = `${Math.floor(Math.random() * 100)}`;
                break;
            case "date":
                input.value = "2024-11-13";
                break;
            case "datetime-local":
                input.value = "2024-11-13T12:00";
                break;
            case "month":
                input.value = "2024-11";
                break;
            case "week":
                input.value = "2024-W46";
                break;
            case "color":
                input.value = "#ff5733";
                break;
            case "range":
                input.value = "50";
                break;
            case "radio":
                input.checked = true;
                break;
        }
    });

    textareas.forEach((textarea) => {
        textarea.value = `Test message`;
    });

    selects.forEach((select) => {
        const options = Array.from(select.options).filter(option => option.value);
        if (options.length > 0) {
            const randomOption = options[Math.floor(Math.random() * options.length)];
            select.value = randomOption.value;
            select.dispatchEvent(new Event("change"));
        }
    });
}

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    if (activeTab) {
        chrome.scripting.executeScript({
            target: { tabId: activeTab.id },
            function: autofillForm
        });
    }
});