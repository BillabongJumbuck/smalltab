import { saveSettingsToStorage } from './storage.js';

export function initSearch(settings, saveSettingsCallback) {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    
    // Custom Select Elements
    const customSelect = document.getElementById('search-engine-dropdown');
    const selectedOption = customSelect.querySelector('.selected-option');
    const currentLabel = document.getElementById('current-engine-label');
    const optionsContainer = customSelect.querySelector('.options-container');
    const optionItems = customSelect.querySelectorAll('.option-item');

    let currentEngine = settings.searchEngine || 'google';

    // Initialize UI
    updateSelectUI(currentEngine);

    // Toggle Dropdown
    selectedOption.addEventListener('click', (e) => {
        e.stopPropagation();
        customSelect.classList.toggle('open');
        optionsContainer.classList.toggle('hidden');
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!customSelect.contains(e.target)) {
            customSelect.classList.remove('open');
            optionsContainer.classList.add('hidden');
        }
    });

    // Handle Option Click
    optionItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            const value = item.dataset.value;
            currentEngine = value;
            updateSelectUI(value);
            
            // Save settings
            settings.searchEngine = value;
            saveSettingsCallback(settings);

            // Close dropdown
            customSelect.classList.remove('open');
            optionsContainer.classList.add('hidden');
        });
    });

    function updateSelectUI(value) {
        // Update Label
        const selectedItem = Array.from(optionItems).find(item => item.dataset.value === value);
        if (selectedItem) {
            currentLabel.textContent = selectedItem.textContent;
            
            // Update active state in list
            optionItems.forEach(opt => opt.classList.remove('selected'));
            selectedItem.classList.add('selected');
        }
    }

    // Handle search submit
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
            const searchUrl = getSearchUrl(currentEngine, query);
            window.location.href = searchUrl;
        }
    });

    // Focus Effects
    searchInput.addEventListener('focus', () => {
        document.body.classList.add('search-focus');
    });

    searchInput.addEventListener('blur', () => {
        document.body.classList.remove('search-focus');
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
