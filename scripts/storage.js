export async function loadFromStorage() {
    const result = await chrome.storage.local.get(['shortcuts', 'settings']);
    return result;
}

export function saveShortcutsToStorage(shortcuts, callback) {
    chrome.storage.local.set({ shortcuts }, callback);
}

export function saveSettingsToStorage(settings, callback) {
    chrome.storage.local.set({ settings }, callback);
}
