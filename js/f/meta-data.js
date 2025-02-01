function displayTitleInfo(title) {
    const titleElement = document.getElementById("title");
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

    if (Array.isArray(keywords) && keywords.length > 0) {
        const keywordsHTML = keywords.map(keyword => `<span class="tag">${keyword}</span>`).join('');
        keywordsElement.innerHTML = keywordsHTML;
    } else {
        keywordsElement.textContent = 'Keywords not found';
    }
}

function displayCanonicalInfo(canonical) {
    const canonicalElement = document.getElementById("canonical");

    if (canonical && canonical.length > 0) {
        canonicalElement.textContent = canonical;
    } else {
        canonicalElement.textContent = 'Canonical tag not found';
    }
}

function displayRobotsInfo(robots) {
    const robotsElement = document.getElementById("robots");

    if (robots && robots.length > 0) {
        const robotsArray = robots.split(',');
        const robotsHTML = robotsArray.map(tag => `<span class="tag">${tag.trim()}</span>`).join(' ');
        robotsElement.innerHTML = robotsHTML;
    } else {
        robotsElement.textContent = 'Robots tag not found';
    }
}

function displayAuthorInfo(author) {
    const authorElement = document.getElementById("author");

    if (author && author.length > 0) {
        authorElement.textContent = author;
    } else {
        authorElement.textContent = 'Author not found';
    }
}

function displayPublisherInfo(publisher) {
    const publisherElement = document.getElementById("publisher");

    if (publisher && publisher.length > 0) {
        publisherElement.textContent = publisher;
    } else {
        publisherElement.textContent = 'Publisher not found';
    }
}

function displayLanguageInfo(language) {
    const languageElement = document.getElementById("language");

    if (language && language.length > 0) {
        languageElement.textContent = language;
    } else {
        languageElement.textContent = 'Language not found';
    }
}

function displayUrlInfo(url) {
    const urlElement = document.getElementById("url");

    if (url && url.length > 0) {
        urlElement.textContent = url;
    } else {
        urlElement.textContent = 'URL not found';
    }
}