function getFonts() {
  const fontUsage = {
    main: new Set(),
    fallback: new Set(),
  };

  try {
    const elements = document.querySelectorAll('*');
    if (elements.length === 0) {
      console.warn('Keine Elemente gefunden.');
      return fontUsage;
    }

    elements.forEach(element => {
      const fontFamily = window.getComputedStyle(element).fontFamily;
      if (fontFamily) {
        const fonts = fontFamily.split(',').map(font => font.trim());

        fontUsage.main.add(fonts[0]);
        if (fonts.length > 1) {
          fonts.slice(1).forEach(fallback => fontUsage.fallback.add(fallback));
        }
      }
    });
  } catch (error) {
    // console.error('Fehler beim Abrufen der Schriftarten:', error);
  }

  return {
    main: Array.from(fontUsage.main),
    fallback: Array.from(fontUsage.fallback)
  };
}

function displayFontList(fontUsage) {
  const fontListElement = document.getElementById("font-list");
  if (!fontListElement || !fontUsage) return;

  fontListElement.innerHTML = '';

  if (fontUsage.main.length > 0) {
    const mainList = document.createElement("ul");
    const mainTitle = document.createElement("h2");
    mainTitle.textContent = "Primary fonts:";
    fontListElement.appendChild(mainTitle);

    fontUsage.main.forEach(font => {
      const listItem = document.createElement("li");
      const fontName = document.createElement("span");
      fontName.textContent = font;
      fontName.style.fontFamily = font;
      listItem.appendChild(fontName);
      mainList.appendChild(listItem);
    });

    fontListElement.appendChild(mainList);
  }

  if (fontUsage.fallback.length > 0) {
    const fallbackList = document.createElement("ul");
    const fallbackTitle = document.createElement("h2");
    fallbackTitle.textContent = "Fallback fonts:";
    fontListElement.appendChild(fallbackTitle);

    fontUsage.fallback.forEach(font => {
      const listItem = document.createElement("li");
      const fontName = document.createElement("span");
      fontName.textContent = font;
      fontName.style.fontFamily = font;
      listItem.appendChild(fontName);
      fallbackList.appendChild(listItem);
    });

    fontListElement.appendChild(fallbackList);
  }
}

function loadFonts() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {

    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: getFonts
    }, (results) => {
      if (results && results[0]) {
        displayFontList(results[0].result);
      } else {
        // console.error('Fehler: Keine Schriftarten gefunden oder das Skript hat nicht funktioniert.');
      }
    });
  });
}

loadFonts();
