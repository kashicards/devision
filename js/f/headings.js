function displayHeadingsInfo(headings) {
    const headingsList = document.getElementById("headings-list");
    const counterContainer = document.getElementById("heading-counter-container");

    headingsList.innerHTML = "";
    counterContainer.innerHTML = "";

    const headingCounters = {
        H1: 0,
        H2: 0,
        H3: 0,
        H4: 0,
        H5: 0,
        H6: 0
    };

    headings.forEach(heading => {
        headingCounters[heading.tag]++;

        const listItem = document.createElement("li");

        const strongTag = document.createElement("strong");
        strongTag.textContent = heading.tag;

        listItem.appendChild(strongTag);
        listItem.appendChild(document.createTextNode(` ${headingCounters[heading.tag]}: ${heading.text}`));

        const headingLevel = parseInt(heading.tag.replace("H", ""));
        listItem.style.marginLeft = `${(headingLevel - 1) * 15}px`;
        listItem.classList.add("heading-item");

        headingsList.appendChild(listItem);
    });

    Object.keys(headingCounters).forEach(tag => {
        const counterBox = document.createElement("div");
        counterBox.classList.add("heading-counter-box", "counter");
        counterBox.textContent = `${tag}: ${headingCounters[tag]}`;
        counterContainer.appendChild(counterBox);
    });
}
