function displayImageInfo(images) {
    const imagesList = document.getElementById("images-list");
    const noAltCounter = document.getElementById("no-alt-counter");

    let noAltCount = 0;

    imagesList.innerHTML = "";

    images.forEach((img) => {
        const listItem = document.createElement("li");
        const dimensions = `<span class="image-dimensions">[ ${img.width}px x ${img.height}px ]</span>`;
        const altText = `<span class="image-alt-text">- ${img.alt}</span>`;

        listItem.innerHTML = `<a href="${img.src}" target="_blank">${img.src}</a> ${dimensions} ${altText}`;

        if (img.alt === "Kein Alt-Text vorhanden") {
            listItem.classList.add("no-alt");
            noAltCount++;
        }

        imagesList.appendChild(listItem);
    });

    noAltCounter.textContent = `Counter: ${noAltCount}`;
}

