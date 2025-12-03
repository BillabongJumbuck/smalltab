document.addEventListener('DOMContentLoaded', () => {
    // State
    let shortcuts = [];
    let settings = {
        backgroundImage: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=2070&auto=format&fit=crop' // Default nature background
    };

    // DOM Elements
    const grid = document.getElementById('quick-access-grid');
    const addBtn = document.getElementById('add-shortcut-btn');
    const backgroundLayer = document.getElementById('background-layer');
    
    // Modal Elements
    const shortcutModal = document.getElementById('shortcut-modal');
    const settingsModal = document.getElementById('settings-modal');
    const settingsBtn = document.getElementById('settings-btn');
    
    // Form Elements
    const saveShortcutBtn = document.getElementById('save-shortcut');
    const cancelShortcutBtn = document.getElementById('cancel-shortcut');
    const titleInput = document.getElementById('shortcut-title');
    const urlInput = document.getElementById('shortcut-url');
    const iconInput = document.getElementById('shortcut-icon');
    
    const bgUrlInput = document.getElementById('bg-url');
    const bgUploadInput = document.getElementById('bg-upload');
    const closeSettingsBtn = document.getElementById('close-settings');

    // --- Initialization ---
    localizeHtml();
    loadData();

    // --- Functions ---

    function localizeHtml() {
        // Localize text content
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const message = chrome.i18n.getMessage(key);
            if (message) {
                element.textContent = message;
            }
        });

        // Localize placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            const message = chrome.i18n.getMessage(key);
            if (message) {
                element.placeholder = message;
            }
        });
        
        // Localize aria-labels
        document.querySelectorAll('[data-i18n-aria]').forEach(element => {
            const key = element.getAttribute('data-i18n-aria');
            const message = chrome.i18n.getMessage(key);
            if (message) {
                element.setAttribute('aria-label', message);
            }
        });
    }

    function getDomain(url) {
        try {
            return new URL(url).hostname;
        } catch (e) {
            return url;
        }
    }

    async function loadData() {
        try {
            const result = await chrome.storage.local.get(['shortcuts', 'settings']);
            
            if (result.shortcuts) {
                shortcuts = result.shortcuts;
            } else {
                // Default shortcuts if none exist
                // Removed hardcoded .ico to use the new auto-fetch logic
                shortcuts = [
                    { id: '1', title: 'Google', url: 'https://www.google.com', iconUrl: '' },
                    { id: '2', title: 'YouTube', url: 'https://www.youtube.com', iconUrl: '' },
                    { id: '3', title: 'GitHub', url: 'https://github.com', iconUrl: '' }
                ];
                saveShortcuts();
            }

            if (result.settings) {
                settings = { ...settings, ...result.settings };
            }
            
            renderGrid();
            applySettings();
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    function saveShortcuts() {
        chrome.storage.local.set({ shortcuts }, () => {
            renderGrid();
        });
    }

    function saveSettings() {
        chrome.storage.local.set({ settings }, () => {
            applySettings();
        });
    }

    function applySettings() {
        if (settings.backgroundImage) {
            backgroundLayer.style.backgroundImage = `url('${settings.backgroundImage}')`;
        }
    }

    function renderGrid() {
        // Clear existing shortcuts (except the add button)
        const items = grid.querySelectorAll('.shortcut-item:not(.add-button)');
        items.forEach(item => item.remove());

        // Insert shortcuts before the add button
        shortcuts.forEach(shortcut => {
            const el = createShortcutElement(shortcut);
            grid.insertBefore(el, addBtn);
        });
    }

    function createShortcutElement(shortcut) {
        const div = document.createElement('a');
        div.className = 'shortcut-item';
        div.href = shortcut.url;
        
        const domain = getDomain(shortcut.url);
        // Strategy:
        // 1. User provided iconUrl (if exists)
        // 2. Clearbit Logo API (High quality logos)
        // 3. Google Favicon API with large size (sz=128) as fallback
        
        const googleFavicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
        const clearbitLogo = `https://logo.clearbit.com/${domain}`;

        // Create Image Element Programmatically to avoid CSP inline handler issues
        const img = document.createElement('img');
        img.className = 'shortcut-icon';
        img.alt = shortcut.title;

        if (shortcut.iconUrl) {
            img.src = shortcut.iconUrl;
            // Fallback to Google if user provided URL fails
            img.addEventListener('error', () => {
                img.src = googleFavicon;
            }, { once: true });
        } else {
            // Try Clearbit first, fallback to Google
            img.src = clearbitLogo;
            img.addEventListener('error', () => {
                img.src = googleFavicon;
            }, { once: true });
        }

        // Construct the card
        div.appendChild(img);

        const titleDiv = document.createElement('div');
        titleDiv.className = 'shortcut-title';
        titleDiv.textContent = shortcut.title;
        div.appendChild(titleDiv);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.dataset.id = shortcut.id;
        deleteBtn.textContent = '×';
        div.appendChild(deleteBtn);

        // Handle delete click
        deleteBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent navigation
            e.stopPropagation();
            deleteShortcut(shortcut.id);
        });

        return div;
    }

    function deleteShortcut(id) {
        if (confirm(chrome.i18n.getMessage('deleteConfirm'))) {
            shortcuts = shortcuts.filter(s => s.id !== id);
            saveShortcuts();
        }
    }

    function addShortcut() {
        const title = titleInput.value.trim();
        let url = urlInput.value.trim();
        const iconUrl = iconInput.value.trim();

        if (!title || !url) {
            alert(chrome.i18n.getMessage('inputError'));
            return;
        }

        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }

        const newShortcut = {
            id: Date.now().toString(),
            title,
            url,
            iconUrl
        };

        shortcuts.push(newShortcut);
        saveShortcuts();
        closeModal(shortcutModal);
        
        // Reset form
        titleInput.value = '';
        urlInput.value = '';
        iconInput.value = '';
    }

    // --- Event Listeners ---

    // Modals
    function openModal(modal) {
        modal.classList.remove('hidden');
    }

    function closeModal(modal) {
        modal.classList.add('hidden');
    }

    addBtn.addEventListener('click', () => openModal(shortcutModal));
    cancelShortcutBtn.addEventListener('click', () => closeModal(shortcutModal));
    
    settingsBtn.addEventListener('click', () => {
        bgUrlInput.value = settings.backgroundImage || '';
        openModal(settingsModal);
    });
    
    closeSettingsBtn.addEventListener('click', () => closeModal(settingsModal));

    // Save Shortcut
    saveShortcutBtn.addEventListener('click', addShortcut);

    // Background Settings
    bgUrlInput.addEventListener('change', () => {
        const url = bgUrlInput.value.trim();
        if (url) {
            settings.backgroundImage = url;
            saveSettings();
        }
    });

    bgUploadInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                // Check size - chrome.storage.local has a quota (5MB usually, but can be unlimited in manifest v3 with 'unlimitedStorage' permission if needed, but standard is 5MB)
                // Base64 strings can be large.
                const base64String = event.target.result;
                if (base64String.length > 4000000) { // ~4MB limit safety
                    alert(chrome.i18n.getMessage('imageSizeError'));
                    return;
                }
                settings.backgroundImage = base64String;
                saveSettings();
                bgUrlInput.value = ''; // Clear URL input if file is used
            };
            reader.readAsDataURL(file);
        }
    });

    // Close modals on outside click
    window.addEventListener('click', (e) => {
        if (e.target === shortcutModal) closeModal(shortcutModal);
        if (e.target === settingsModal) closeModal(settingsModal);
    });
});
