function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgb(${r}, ${g}, ${b})`;
}

async function pickColor() {
    if (!window.EyeDropper) {
        alert("Your browser does not support the EyeDropper API.");
        return;
    }

    const eyeDropper = new EyeDropper();

    try {
        const result = await eyeDropper.open();
        const color = result.sRGBHex;

        document.getElementById("colorDisplay").value = color;
        updateColorValues(color);
    } catch (error) {
        // console.error("Error picking color: ", error);
    }
}

function updateColorValues(color) {
    document.getElementById("hexValue").textContent = color;
    document.getElementById("rgbValue").textContent = hexToRgb(color);
}

function copyToClipboardAndShowMessage(text, elementId) {
    navigator.clipboard.writeText(text).then(() => {
        const element = document.getElementById(elementId);
        element.textContent = "Copied!";
        setTimeout(() => {
            element.textContent = text;
        }, 2000);
    }).catch(err => {
        // console.error("Error copying to clipboard: ", err);
    });
}

document.getElementById("hexValue").addEventListener("click", function () {
    const hex = this.textContent;
    copyToClipboardAndShowMessage(hex, "hexValue");
});

document.getElementById("rgbValue").addEventListener("click", function () {
    const rgb = this.textContent;
    copyToClipboardAndShowMessage(rgb, "rgbValue");
});

document.getElementById("pickColorBtn")?.addEventListener("click", pickColor);

document.getElementById("colorDisplay").addEventListener("input", function () {
    const color = this.value;
    updateColorValues(color);
});
