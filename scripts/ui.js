import { getDomain } from './utils.js';

export function renderGrid(shortcuts, gridElement, addBtnElement, onDelete) {
    // Clear existing shortcuts (except the add button)
    const items = gridElement.querySelectorAll('.shortcut-item:not(.add-button)');
    items.forEach(item => item.remove());

    // Insert shortcuts before the add button
    shortcuts.forEach(shortcut => {
        const el = createShortcutElement(shortcut, onDelete);
        gridElement.insertBefore(el, addBtnElement);
    });
}

export function createShortcutElement(shortcut, onDelete) {
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
    deleteBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
    div.appendChild(deleteBtn);

    // Handle delete click
    deleteBtn.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent navigation
        e.stopPropagation();
        onDelete(shortcut.id);
    });

    return div;
}

export function applyBackground(settings, backgroundElement) {
    if (settings.backgroundImage) {
        backgroundElement.style.backgroundImage = `url('${settings.backgroundImage}')`;
    }
}

export function openModal(modal) {
    modal.classList.remove('hidden');
}

export function closeModal(modal) {
    modal.classList.add('hidden');
}
