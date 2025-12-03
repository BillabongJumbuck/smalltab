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

export async function exportData() {
    const data = await loadFromStorage();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `smalltab-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export function importData(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.shortcuts || data.settings) {
                    await chrome.storage.local.set(data);
                    resolve(data);
                } else {
                    reject(new Error('Invalid data format'));
                }
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = () => reject(new Error('File read error'));
        reader.readAsText(file);
    });
}
