function displayImageInfo(images) {
    const headerImagesList = document.getElementById("header-images-list");
    const navImagesList = document.getElementById("nav-images-list");
    const mainImagesList = document.getElementById("main-images-list");
    const footerImagesList = document.getElementById("footer-images-list");
    const noAltCounter = document.getElementById("no-alt-counter");

    if (!headerImagesList || !navImagesList || !mainImagesList || !footerImagesList || !noAltCounter) {
        console.warn("One or more elements are missing!");
        return;
    }

    // Listen leeren
    headerImagesList.innerHTML = "";
    navImagesList.innerHTML = "";
    mainImagesList.innerHTML = "";
    footerImagesList.innerHTML = "";

    let noAltCount = 0;

    images.forEach((img, index) => {
        if (!img.src || !/^https?:\/\//.test(img.src)) {
            console.warn(`Skipping invalid image source at index ${index}:`, img.src);
            return;
        }

        const listItem = document.createElement("li");
        const link = document.createElement("a");
        link.href = img.src;
        link.target = "_blank";
        link.textContent = img.src;

        const dimensions = document.createElement("span");
        dimensions.textContent = ` [ ${img.width}px x ${img.height}px ]`;

        const altText = document.createElement("span");
        altText.textContent = ` - ${img.alt}`;

        listItem.appendChild(link);
        listItem.appendChild(dimensions);
        listItem.appendChild(altText);

        if (img.alt === "alt is missing") {
            listItem.classList.add("no-alt");
            noAltCount++;
        }

        const parentTag = img.parentTag ? img.parentTag.toLowerCase() : "main";

        switch (parentTag) {
            case "header":
                headerImagesList.appendChild(listItem);
                break;
            case "nav":
                navImagesList.appendChild(listItem);
                break;
            case "footer":
                footerImagesList.appendChild(listItem);
                break;
            default:
                mainImagesList.appendChild(listItem);
        }
    });

    noAltCounter.textContent = `Counter: ${noAltCount}`;
}
