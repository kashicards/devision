function displayTitleInfo(title) {
    const titleElement = document.getElementById("title");
    if (!titleElement) return;

    titleElement.textContent = title;

    const titleLength = title.length;
    let statusClass = "";
    let statusText = "";

    if (titleLength >= 50 && titleLength <= 60) {
        statusClass = "good";
        statusText = "good";
    } else if (titleLength >= 40 && titleLength < 50) {
        statusClass = "average";
        statusText = "average";
    } else {
        statusClass = "bad";
        statusText = "bad";
    }

    const lengthSpan = document.createElement("span");
    lengthSpan.textContent = ` (${titleLength} characters) ${statusText}`;
    lengthSpan.classList.add("title-status", statusClass);

    titleElement.appendChild(lengthSpan);
}

function displayDescriptionInfo(description) {
    const descriptionElement = document.getElementById("description");
    if (!descriptionElement) return;

    descriptionElement.textContent = description;

    const descriptionLength = description.length;
    let statusClass = "";
    let statusText = "";

    if (descriptionLength >= 150 && descriptionLength <= 160) {
        statusClass = "good";
        statusText = "good";
    } else if (descriptionLength >= 140 && descriptionLength < 150) {
        statusClass = "average";
        statusText = "average";
    } else {
        statusClass = "bad";
        statusText = "bad";
    }

    const lengthSpan = document.createElement("span");
    lengthSpan.textContent = ` (${descriptionLength} characters) ${statusText}`;
    lengthSpan.classList.add("description-status", statusClass);

    descriptionElement.appendChild(lengthSpan);
}

function displayKeywordsInfo(keywords) {
    const keywordsElement = document.getElementById("keywords");
    if (!keywordsElement) return;

    keywordsElement.innerHTML = ""; // Vorherigen Inhalt leeren

    if (Array.isArray(keywords) && keywords.length > 0) {
        keywords.forEach(keyword => {
            const keywordSpan = document.createElement("span");
            keywordSpan.classList.add("tag");
            keywordSpan.textContent = keyword;
            keywordsElement.appendChild(keywordSpan);
        });
    } else {
        keywordsElement.textContent = 'Keywords not found';
    }
}

function displayCanonicalInfo(canonical) {
    const canonicalElement = document.getElementById("canonical");
    if (!canonicalElement) return;

    canonicalElement.textContent = canonical && canonical.trim() ? canonical : 'Canonical tag not found';
}

function displayRobotsInfo(robots) {
    const robotsElement = document.getElementById("robots");
    if (!robotsElement) return;

    robotsElement.innerHTML = ""; // Vorherigen Inhalt leeren

    if (robots && robots.trim().length > 0) {
        robots.split(',').forEach(tag => {
            const robotSpan = document.createElement("span");
            robotSpan.classList.add("tag");
            robotSpan.textContent = tag.trim();
            robotsElement.appendChild(robotSpan);
        });
    } else {
        robotsElement.textContent = 'Robots tag not found';
    }
}

function displayAuthorInfo(author) {
    const authorElement = document.getElementById("author");
    if (!authorElement) return;

    authorElement.textContent = author && author.trim() ? author : 'Author not found';
}

function displayPublisherInfo(publisher) {
    const publisherElement = document.getElementById("publisher");
    if (!publisherElement) return;

    publisherElement.textContent = publisher && publisher.trim() ? publisher : 'Publisher not found';
}

function displayLanguageInfo(language) {
    const languageElement = document.getElementById("language");
    if (!languageElement) return;

    languageElement.textContent = language && language.trim() ? language : 'Language not found';
}

function displayUrlInfo(url) {
    const urlElement = document.getElementById("url");
    if (!urlElement) return;

    urlElement.textContent = url && url.trim() ? url : 'URL not found';
}
