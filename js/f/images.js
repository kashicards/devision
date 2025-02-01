function displayImageInfo(images) {
    const imagesList = document.getElementById("images-list");
    const noAltCounter = document.getElementById("no-alt-counter");

    if (!imagesList || !noAltCounter) return; // Sicherheits-Check gegen null

    let noAltCount = 0;
    imagesList.innerHTML = "";

    images.forEach((img) => {
        if (!img.src || !/^https?:\/\//.test(img.src)) return; // Nur gültige URLs erlauben

        const listItem = document.createElement("li");

        const link = document.createElement("a");
        link.href = img.src;
        link.target = "_blank";
        link.textContent = img.src;

        const dimensions = document.createElement("span");
        dimensions.classList.add("image-dimensions");
        dimensions.textContent = `[ ${img.width}px x ${img.height}px ]`;

        const altText = document.createElement("span");
        altText.classList.add("image-alt-text");
        altText.textContent = ` - ${img.alt.replace(/</g, "&lt;").replace(/>/g, "&gt;")}`; // XSS-Schutz

        listItem.appendChild(link);
        listItem.appendChild(dimensions);
        listItem.appendChild(altText);

        if (img.alt === "Kein Alt-Text vorhanden") {
            listItem.classList.add("no-alt");
            noAltCount++;
        }

        imagesList.appendChild(listItem);
    });

    noAltCounter.textContent = `Counter: ${noAltCount}`;
}
