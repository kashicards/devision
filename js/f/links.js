function displayLinksInfo(links) {
    const headerLinksList = document.getElementById("header-links-list");
    const navLinksList = document.getElementById("nav-links-list");
    const mainLinksList = document.getElementById("main-links-list");
    const footerLinksList = document.getElementById("footer-links-list");
    const noTitleCounter = document.getElementById("no-title-counter");

    if (!headerLinksList || !navLinksList || !mainLinksList || !footerLinksList || !noTitleCounter) return;

    headerLinksList.innerHTML = "";
    navLinksList.innerHTML = "";
    mainLinksList.innerHTML = "";
    footerLinksList.innerHTML = "";

    let noTitleCount = 0;

    links.forEach((link) => {
        const listItem = document.createElement("li");

        const anchor = document.createElement("a");
        anchor.href = link.href || "#";
        anchor.target = link.target === "_blank" ? "_blank" : "_self";
        anchor.rel = "noopener noreferrer";
        anchor.textContent = link.href || "No href";

        const titleText = document.createElement("span");
        const titleValue = link.title ? link.title : "title is missing";
        titleText.textContent = ` - ${titleValue}`;

        const targetText = document.createElement("span");
        targetText.textContent = ` - ${link.target || "No target"}`;

        listItem.appendChild(anchor);
        listItem.appendChild(titleText);
        listItem.appendChild(targetText);

        if (titleValue === "title is missing") {
            listItem.classList.add("no-title");
            noTitleCount++;
        }

        switch (link.parentTag) {
            case "header":
                headerLinksList.appendChild(listItem);
                break;
            case "nav":
                navLinksList.appendChild(listItem);
                break;
            case "main":
                mainLinksList.appendChild(listItem);
                break;
            case "footer":
                footerLinksList.appendChild(listItem);
                break;
            default:
                mainLinksList.appendChild(listItem);
        }
    });

    noTitleCounter.textContent = `Counter: ${noTitleCount}`;
}

// Alle <a>-Tags auf der Seite finden und Informationen sammeln
document.addEventListener("DOMContentLoaded", () => {
    const links = Array.from(document.querySelectorAll("a")).map((link) => ({
        href: link.getAttribute("href"),
        title: link.getAttribute("title"),
        target: link.getAttribute("target"),
        parentTag: link.closest("header, nav, main, footer")?.tagName?.toLowerCase() || "other"
    }));

    displayLinksInfo(links);
});
