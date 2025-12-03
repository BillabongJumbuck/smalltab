import { localizeHtml, getMessage } from './i18n.js';
import { loadFromStorage, saveShortcutsToStorage, saveSettingsToStorage } from './storage.js';
import { renderGrid, applyBackground, openModal, closeModal } from './ui.js';

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
        });
    }

    function render() {
        renderGrid(shortcuts, grid, addBtn, deleteShortcut);
    }

    function deleteShortcut(id) {
        if (confirm(getMessage('deleteConfirm'))) {
            shortcuts = shortcuts.filter(s => s.id !== id);
            saveShortcuts();
        }
    }

    function addShortcut() {
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

    // Close modals on outside click
    window.addEventListener('click', (e) => {
        if (e.target === shortcutModal) closeModal(shortcutModal);
        if (e.target === settingsModal) closeModal(settingsModal);
    });
});
