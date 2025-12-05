import { localizeHtml, getMessage } from './i18n.js';
import { loadFromStorage, saveShortcutsToStorage, saveSettingsToStorage, exportData, importData } from './storage.js';
import { renderGrid, applyBackground, applyScale, openModal, closeModal } from './ui.js';
import { initSearch } from './search.js';
import { initClock } from './clock.js';

document.addEventListener('DOMContentLoaded', () => {
    // State
    let shortcuts = [];
    let editingId = null;
    let settings = {
        backgroundImage: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=2070&auto=format&fit=crop', // Default nature background
        searchEngine: 'google',
        clockScale: 1.0,
        cardScale: 1.0
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

    // Appearance Elements
    const clockSizeSlider = document.getElementById('clock-size-slider');
    const clockSizeValue = document.getElementById('clock-size-value');
    const cardSizeSlider = document.getElementById('card-size-slider');
    const cardSizeValue = document.getElementById('card-size-value');

    // Data Management Elements
    const exportBtn = document.getElementById('export-btn');
    const importTriggerBtn = document.getElementById('import-trigger-btn');
    const importFileInput = document.getElementById('import-file');

    // --- Initialization ---
    localizeHtml();
    initClock();
    initData();

    // --- Functions ---

    async function initData() {
        try {
            const result = await loadFromStorage();
            
            if (result.shortcuts) {
                shortcuts = result.shortcuts;
            } else {
                // Default shortcuts if none exist
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
            
            render();
            applyBackground(settings, backgroundLayer);
            applyScale(settings);
            initSearch(settings, (newSettings) => {
                settings = newSettings;
                saveSettings();
            });
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    function saveShortcuts() {
        saveShortcutsToStorage(shortcuts, () => {
            render();
        });
    }

    function saveSettings() {
        saveSettingsToStorage(settings, () => {
            applyBackground(settings, backgroundLayer);
            applyScale(settings);
        });
    }

    function render() {
        renderGrid(shortcuts, grid, addBtn, deleteShortcut, handleReorder, editShortcut);
    }

    function handleReorder(newIds) {
        const newShortcuts = newIds.map(id => shortcuts.find(s => s.id === id)).filter(Boolean);
        shortcuts = newShortcuts;
        // Save silently or with render? 
        // Since DOM is already updated by drag events, we just need to persist.
        // But saveShortcuts() calls render(), which is fine to ensure consistency.
        saveShortcuts();
    }

    function deleteShortcut(id) {
        if (confirm(getMessage('deleteConfirm'))) {
            shortcuts = shortcuts.filter(s => s.id !== id);
            saveShortcuts();
        }
    }

    function editShortcut(shortcut) {
        editingId = shortcut.id;
        titleInput.value = shortcut.title;
        urlInput.value = shortcut.url;
        iconInput.value = shortcut.iconUrl || '';
        openModal(shortcutModal);
    }

    function handleSaveShortcut() {
        const title = titleInput.value.trim();
        let url = urlInput.value.trim();
        const iconUrl = iconInput.value.trim();

        if (!title || !url) {
            alert(getMessage('inputError'));
            return;
        }

        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }

        if (editingId) {
            // Update existing
            const index = shortcuts.findIndex(s => s.id === editingId);
            if (index !== -1) {
                shortcuts[index] = {
                    ...shortcuts[index],
                    title,
                    url,
                    iconUrl
                };
            }
        } else {
            // Add new
            const newShortcut = {
                id: Date.now().toString(),
                title,
                url,
                iconUrl
            };
            shortcuts.push(newShortcut);
        }

        saveShortcuts();
        closeModal(shortcutModal);
        resetShortcutForm();
    }

    function resetShortcutForm() {
        editingId = null;
        titleInput.value = '';
        urlInput.value = '';
        iconInput.value = '';
    }

    // --- Event Listeners ---

    addBtn.addEventListener('click', () => {
        resetShortcutForm();
        openModal(shortcutModal);
    });
    
    cancelShortcutBtn.addEventListener('click', () => {
        closeModal(shortcutModal);
        resetShortcutForm();
    });
    
    settingsBtn.addEventListener('click', () => {
        bgUrlInput.value = settings.backgroundImage || '';
        
        // Set slider values
        clockSizeSlider.value = settings.clockScale || 1.0;
        clockSizeValue.textContent = (settings.clockScale || 1.0) + 'x';
        cardSizeSlider.value = settings.cardScale || 1.0;
        cardSizeValue.textContent = (settings.cardScale || 1.0) + 'x';

        openModal(settingsModal);
    });
    
    closeSettingsBtn.addEventListener('click', () => closeModal(settingsModal));

    // Save Shortcut
    saveShortcutBtn.addEventListener('click', handleSaveShortcut);

    // Appearance Settings
    clockSizeSlider.addEventListener('input', (e) => {
        const val = e.target.value;
        clockSizeValue.textContent = val + 'x';
        settings.clockScale = val;
        applyScale(settings); // Apply immediately for preview
        saveSettings(); // Debounce could be better but local storage is fast enough
    });

    cardSizeSlider.addEventListener('input', (e) => {
        const val = e.target.value;
        cardSizeValue.textContent = val + 'x';
        settings.cardScale = val;
        applyScale(settings);
        saveSettings();
    });

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
                    alert(getMessage('imageSizeError'));
                    return;
                }
                settings.backgroundImage = base64String;
                saveSettings();
                bgUrlInput.value = ''; // Clear URL input if file is used
            };
            reader.readAsDataURL(file);
        }
    });

    // Data Management
    exportBtn.addEventListener('click', exportData);
    
    importTriggerBtn.addEventListener('click', () => {
        importFileInput.click();
    });

    importFileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                await importData(file);
                alert(getMessage('importSuccess'));
                location.reload(); // Reload to apply changes
            } catch (error) {
                console.error(error);
                alert(getMessage('importError'));
            }
            // Reset input
            importFileInput.value = '';
        }
    });

    // Close modals on outside click
    window.addEventListener('click', (e) => {
        if (e.target === shortcutModal) closeModal(shortcutModal);
        if (e.target === settingsModal) closeModal(settingsModal);
    });
});
