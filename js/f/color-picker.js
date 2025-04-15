function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
}

function rgbToHex(r, g, b) {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}

function rgbToHsl(r, g, b) {
    r /= 255, g /= 255, b /= 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) {
        h = s = 0;
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h *= 60;
    }
    return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
}

function hslToRgb(h, s, l) {
    s /= 100;
    l /= 100;
    let c = (1 - Math.abs(2 * l - 1)) * s;
    let x = c * (1 - Math.abs((h / 60) % 2 - 1));
    let m = l - c / 2;
    let r = 0, g = 0, b = 0;

    if (h < 60) { r = c; g = x; }
    else if (h < 120) { r = x; g = c; }
    else if (h < 180) { g = c; b = x; }
    else if (h < 240) { g = x; b = c; }
    else if (h < 300) { r = x; b = c; }
    else { r = c; b = x; }

    return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
}

async function pickColor() {
    if (!window.EyeDropper) {
        alert("Your browser does not support the EyeDropper API.");
        return;
    }
    const eyeDropper = new EyeDropper();
    try {
        const result = await eyeDropper.open();
        updateColorValues(result.sRGBHex);
    } catch (error) {
        console.error("Error picking color: ", error);
    }
}

function updateColorValues(color) {
    let r, g, b;
    if (color.startsWith("#")) {
        [r, g, b] = hexToRgb(color);
    } else if (color.startsWith("rgb")) {
        [r, g, b] = color.match(/\d+/g).map(Number);
    } else if (color.startsWith("hsl")) {
        let [h, s, l] = color.match(/\d+/g).map(Number);
        [r, g, b] = hslToRgb(h, s, l);
    }

    document.getElementById("colorDisplay").value = rgbToHex(r, g, b);
    document.getElementById("colorDisplay").style.backgroundColor = rgbToHex(r, g, b);
    document.getElementById("hexValue").value = rgbToHex(r, g, b);
    document.getElementById("rgbValue").value = `rgb(${r}, ${g}, ${b})`;
    let [h, s, l] = rgbToHsl(r, g, b);
    document.getElementById("hslValue").value = `hsl(${h}, ${s}%, ${l}%)`;
    updateCssOutput(rgbToHex(r, g, b));
}

function updateCssOutput(color) {
    document.getElementById("cssColorCode").value = `color: ${color};`;
    document.getElementById("cssBgCode").value = `background-color: ${color};`;
}


document.getElementById("hexValue").addEventListener("input", function () {
    const color = this.value;
    if (/^#[0-9A-Fa-f]{6}$/.test(color)) {
        updateColorValues(color);
    }
});

document.getElementById("rgbValue").addEventListener("input", function () {
    const match = this.value.trim().match(/^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/);
    if (match) {
        const [_, r, g, b] = match.map(Number);
        if ([r, g, b].every(n => n >= 0 && n <= 255)) {
            updateColorValues(`rgb(${r}, ${g}, ${b})`);
        }
    }
});

document.getElementById("hslValue").addEventListener("input", function () {
    const match = this.value.match(/\d+/g);
    if (match && match.length === 3) {
        updateColorValues(`hsl(${match.join(", ")})`);
    }
});

document.getElementById("colorDisplay").addEventListener("input", function () {
    updateColorValues(this.value);
});

document.getElementById("pickColorBtn")?.addEventListener("click", pickColor);

function copyToClipboard(targetId, wrapper) {
    const input = document.getElementById(targetId);
    if (input) {
        input.select();
        document.execCommand("copy");

        wrapper.style.setProperty("--copy-text", '"Copied!"');

        wrapper.classList.add("copied");

        setTimeout(() => {
            wrapper.classList.remove("copied");
            wrapper.style.setProperty("--copy-text", '"Copy"');
        }, 1000);
    }
}

document.querySelectorAll(".copy-wrapper img.copy-button").forEach((img) => {
    img.addEventListener("click", function () {
        const wrapper = this.parentElement;
        const targetId = wrapper.getAttribute("data-copy-target");
        copyToClipboard(targetId, wrapper);
    });
});

