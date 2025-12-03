import { saveSettingsToStorage } from './storage.js';

export function initSearch(settings, saveSettingsCallback) {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const engineSelect = document.getElementById('search-engine-select');

    // Set initial engine
    if (settings.searchEngine) {
        engineSelect.value = settings.searchEngine;
    }

    // Handle engine change
    engineSelect.addEventListener('change', () => {
        settings.searchEngine = engineSelect.value;
        saveSettingsCallback(settings);
    });

    // Handle search submit
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
            const engine = engineSelect.value;
            const searchUrl = getSearchUrl(engine, query);
            window.location.href = searchUrl;
        }
    });
}

function getSearchUrl(engine, query) {
    const encodedQuery = encodeURIComponent(query);
    switch (engine) {
        case 'bing':
            return `https://www.bing.com/search?q=${encodedQuery}`;
        case 'baidu':
            return `https://www.baidu.com/s?wd=${encodedQuery}`;
        case 'google':
        default:
            return `https://www.google.com/search?q=${encodedQuery}&ie=UTF-8`;
    }
}
