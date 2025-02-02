const displaySchemaData = (schemaData) => {
    const schemaContainer = document.getElementById('schema-data');
    if (!schemaContainer) return;

    schemaContainer.innerHTML = '';

    if (!Array.isArray(schemaData) || schemaData.length === 0) {
        const noDataMessage = document.createElement('p');
        noDataMessage.textContent = 'No schema data found.';
        schemaContainer.appendChild(noDataMessage);
        return;
    }

    const displayedSchemaTypes = new Set();

    schemaData.forEach(item => {
        const schemas = item['@graph'] || [item];

        schemas.forEach(schemaItem => {
            const schemaType = schemaItem['@type'] || 'Unbekannt';

            if (displayedSchemaTypes.has(schemaType)) return;
            displayedSchemaTypes.add(schemaType);

            const schemaElement = document.createElement('div');
            schemaElement.classList.add('schema-item');

            const schemaHeader = document.createElement('h1');
            schemaHeader.classList.add('collapser-headline');
            schemaHeader.textContent = schemaType;
            schemaElement.appendChild(schemaHeader);

            const dl = document.createElement('div');
            dl.classList.add('collapser-content');

            Object.entries(schemaItem).forEach(([key, value]) => {
                if (key !== '@type') {
                    const keyValueContainer = document.createElement('div');
                    keyValueContainer.classList.add('key-value-container');

                    const dt = document.createElement('div');
                    dt.classList.add('schema-key');
                    dt.textContent = key;

                    const dd = document.createElement('div');
                    dd.classList.add('schema-value');

                    if (Array.isArray(value)) {
                        value.forEach(item => {
                            const nestedDiv = document.createElement('div');
                            nestedDiv.classList.add('schema-nested');
                            if (typeof item === 'object' && item !== null) {
                                const nestedDlObject = document.createElement('div');
                                nestedDlObject.classList.add('nested-object');
                                Object.entries(item).forEach(([nestedKey, nestedValue]) => {
                                    const nestedKeyElement = document.createElement('div');
                                    nestedKeyElement.classList.add('nested-key');
                                    nestedKeyElement.textContent = nestedKey;

                                    const nestedValueElement = document.createElement('div');
                                    nestedValueElement.classList.add('nested-value');
                                    nestedValueElement.textContent = nestedValue;

                                    nestedDlObject.appendChild(nestedKeyElement);
                                    nestedDlObject.appendChild(nestedValueElement);
                                });
                                nestedDiv.appendChild(nestedDlObject);
                            } else {
                                nestedDiv.textContent = String(item);
                            }
                            dd.appendChild(nestedDiv);
                        });
                    } else if (typeof value === 'object' && value !== null) {
                        const nestedDl = document.createElement('div');
                        nestedDl.classList.add('nested-object');
                        Object.entries(value).forEach(([nestedKey, nestedValue]) => {
                            const nestedKeyElement = document.createElement('div');
                            nestedKeyElement.classList.add('nested-key');
                            nestedKeyElement.textContent = nestedKey;

                            const nestedValueElement = document.createElement('div');
                            nestedValueElement.classList.add('nested-value');
                            nestedValueElement.textContent = String(nestedValue);

                            nestedDl.appendChild(nestedKeyElement);
                            nestedDl.appendChild(nestedValueElement);
                        });
                        dd.appendChild(nestedDl);
                    } else {
                        dd.textContent = String(value);
                    }

                    keyValueContainer.appendChild(dt);
                    keyValueContainer.appendChild(dd);
                    dl.appendChild(keyValueContainer);
                }
            });

            if (schemaType === 'Rating') {
                const ratingValue = schemaItem.ratingValue || 'N/A';
                const bestRating = schemaItem.bestRating || 'N/A';
                const worstRating = schemaItem.worstRating || 'N/A';

                const ratingElement = document.createElement('div');
                ratingElement.classList.add('rating-item');

                const ratingHeader = document.createElement('h2');
                ratingHeader.textContent = 'Rating';

                const ratingParagraph = document.createElement('p');
                ratingParagraph.textContent = `Wertung: ${ratingValue} (Best: ${bestRating}, Worst: ${worstRating})`;

                ratingElement.appendChild(ratingHeader);
                ratingElement.appendChild(ratingParagraph);
                schemaElement.appendChild(ratingElement);
            }

            schemaElement.appendChild(dl);
            schemaContainer.appendChild(schemaElement);
        });
    });
};

const getAllSchemaData = () => {
    const schemaScripts = document.querySelectorAll('script[type="application/ld+json"]');
    const schemaData = [];

    schemaScripts.forEach(script => {
        try {
            const data = JSON.parse(script.textContent.trim());
            if (Array.isArray(data)) {
                schemaData.push(...data);
            } else if (typeof data === 'object' && data !== null) {
                schemaData.push(data);
            }
        } catch (e) {
            // console.error('Fehler beim Parsen von Schema-Daten:', e);
        }
    });

    return schemaData;
};

const loadSchemaData = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs || tabs.length === 0) return;
        const activeTab = tabs[0];

        chrome.scripting.executeScript({
            target: { tabId: activeTab.id },
            function: () => {
                try {
                    return [...document.querySelectorAll('script[type="application/ld+json"]')]
                        .map(script => JSON.parse(script.textContent.trim()))
                        .filter(data => data !== null);
                } catch (e) {
                    // console.error('Fehler beim Extrahieren der Schema-Daten:', e);
                    return [];
                }
            }
        }, (result) => {
            if (!result || !Array.isArray(result) || !result[0] || !result[0].result) return;
            displaySchemaData(result[0].result);
        });
    });
};

const schemaData = getAllSchemaData();
displaySchemaData(schemaData);
loadSchemaData();
