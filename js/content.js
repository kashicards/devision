const extractPageData = () => {
    const canonicalLink = document.querySelector("link[rel='canonical']")?.getAttribute("href") || "Canonical tag not found";
    const robotsMeta = document.querySelector("meta[name='robots']")?.getAttribute("content");
    const authorMeta = document.querySelector("meta[name='author']")?.getAttribute("content") || "Author not found";
    const publisherMeta = document.querySelector("meta[name='publisher']")?.getAttribute("content") || "Publisher not found";
    const languageMeta = document.documentElement.lang || "Language not found";

    const headings = [...document.querySelectorAll("h1, h2, h3, h4, h5, h6")].map(heading => ({
        tag: heading.tagName,
        text: heading.textContent.trim()
    }));

    const links = [...document.querySelectorAll("a")].map(link => {
        const parentTag = link.closest("header, nav, main, footer")?.tagName.toLowerCase() || "main";
        return {
            href: link.href,
            title: link.getAttribute("title") || "title is missing",
            parentTag: parentTag,
            target: link.getAttribute("target") || "_self"
        };
    });

    const images = [...document.querySelectorAll("img")].map(img => {
        const parentElement = img.closest("header, nav, main, footer");
        const parentTag = parentElement ? parentElement.tagName.toLowerCase() : "main";

        return {
            src: img.src,
            width: img.width || img.naturalWidth,
            height: img.height || img.naturalHeight,
            alt: img.getAttribute("alt") || "alt is missing",
            parentTag: parentTag
        };
    });


    const keywordsMeta = document.querySelector("meta[name='keywords']")?.getAttribute("content") || "Keywords not found";
    const keywords = keywordsMeta !== "Keywords not found" ? keywordsMeta.split(',').map(k => k.trim()) : [];

    return {
        title: document.title || "Title not found",
        description: document.querySelector("meta[name='description']")?.getAttribute("content") || "Description not found",
        keywords: keywords,
        headings: headings,
        links: links,
        images: images,
        canonical: canonicalLink,
        robots: robotsMeta,
        author: authorMeta,
        publisher: publisherMeta,
        language: languageMeta,
        url: window.location.href || "URL not found"
    };
};


const pageData = extractPageData();

///
// Diese Funktion wird durch das Popup-Script aktiviert und sorgt für das Deaktivieren von JS und Styles
function toggleJSAndStyles(disableJS, disableStyles) {
    if (disableJS) {
        // Speichere die Original-Scripts, bevor sie entfernt werden
        const scripts = document.querySelectorAll('script');
        scripts.forEach(script => {
            script.setAttribute('data-disabled', 'true');  // Markiere als entfernt
            script.remove(); // Entferne das Script
        });
    }

    if (disableStyles) {
        // Speichere die Original-Stylesheets, bevor sie entfernt oder deaktiviert werden
        const linkStyles = document.querySelectorAll('link[rel="stylesheet"], style');
        linkStyles.forEach(link => {
            link.setAttribute('data-disabled', 'true');  // Markiere als entfernt
            link.disabled = true; // Deaktiviere Styles
        });

        // Speichere Inline-Styles
        const allElements = document.querySelectorAll('*');
        allElements.forEach(element => {
            if (element.hasAttribute('style')) {
                element.setAttribute('data-style', element.getAttribute('style'));
                element.removeAttribute('style');  // Entferne Inline-Style
            }
        });
    }
}

// Prüfe den Zustand der JS- und Styles-Einstellungen direkt nach dem Laden der Seite
chrome.storage.local.get([`${window.location.hostname}-js`, `${window.location.hostname}-styles`], (result) => {
    const disableJS = result[`${window.location.hostname}-js`] === true;
    const disableStyles = result[`${window.location.hostname}-styles`] === true;

    if (disableJS) {
        toggleJSAndStyles(disableJS, disableStyles);
    }
});
