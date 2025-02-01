function displayLinksInfo(links) {
    const headerLinksList = document.getElementById("header-links-list");
    const navLinksList = document.getElementById("nav-links-list");
    const mainLinksList = document.getElementById("main-links-list");
    const footerLinksList = document.getElementById("footer-links-list");
    const noTitleCounter = document.getElementById("no-title-counter");

    headerLinksList.innerHTML = "";
    navLinksList.innerHTML = "";
    mainLinksList.innerHTML = "";
    footerLinksList.innerHTML = "";

    let noTitleCount = 0; 

    links.forEach((link) => {
        const listItem = document.createElement("li");
        const titleText = link.title || "Kein Titel vorhanden";
        
        listItem.innerHTML = `
            <a href="${link.href}" target="${link.target}">${link.href}</a>
            <span> - ${titleText}</span>
            <span> - ${link.target}</span>
        `;

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

        if (titleText === "Kein Titel vorhanden") {
            listItem.classList.add("no-title");
            noTitleCount++;
        }
    });

    noTitleCounter.textContent = `Counter: ${noTitleCount}`;
}