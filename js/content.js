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
            title: link.getAttribute("title") || "Kein Titel vorhanden",
            parentTag: parentTag,
            target: link.getAttribute("target") || "_self"
        };
    });

    const images = [...document.querySelectorAll("img")].map(img => ({
        src: img.src,
        width: img.width || img.naturalWidth,
        height: img.height || img.naturalHeight,
        alt: img.getAttribute("alt") || "Kein Alt-Text vorhanden"
    }));

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

