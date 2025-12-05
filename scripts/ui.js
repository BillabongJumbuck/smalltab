import { getDomain } from './utils.js';

export function renderGrid(shortcuts, gridElement, addBtnElement, onDelete, onReorder, onEdit) {
    // Clear existing shortcuts (except the add button)
    const items = gridElement.querySelectorAll('.shortcut-item:not(.add-button)');
    items.forEach(item => item.remove());

    let draggedItem = null;

    // Insert shortcuts before the add button
    shortcuts.forEach(shortcut => {
        const el = createShortcutElement(shortcut, onDelete, onEdit);
        
        // Drag and Drop Logic
        el.setAttribute('draggable', 'true');
        el.dataset.id = shortcut.id;

        el.addEventListener('dragstart', (e) => {
            draggedItem = el;
            el.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            // Required for Firefox
            e.dataTransfer.setData('text/plain', shortcut.id);
        });

        el.addEventListener('dragend', () => {
            el.classList.remove('dragging');
            draggedItem = null;
            
            // Calculate new order
            const newOrderIds = Array.from(gridElement.querySelectorAll('.shortcut-item:not(.add-button)'))
                .map(item => item.dataset.id);
            
            if (onReorder) {
                onReorder(newOrderIds);
            }
        });

        el.addEventListener('dragover', (e) => {
            e.preventDefault(); // Allow drop
            if (!draggedItem || draggedItem === el) return;

            // Get all shortcut items to determine order
            const siblings = Array.from(gridElement.querySelectorAll('.shortcut-item:not(.add-button)'));
            const draggedIndex = siblings.indexOf(draggedItem);
            const targetIndex = siblings.indexOf(el);

            if (draggedIndex !== -1 && targetIndex !== -1) {
                if (draggedIndex < targetIndex) {
                    // Moving forward: insert after the target
                    gridElement.insertBefore(draggedItem, el.nextSibling);
                } else {
                    // Moving backward: insert before the target
                    gridElement.insertBefore(draggedItem, el);
                }
            }
        });

        el.addEventListener('dragenter', (e) => {
            if (draggedItem && draggedItem !== el) {
                el.classList.add('drag-over');
            }
        });

        el.addEventListener('dragleave', () => {
            el.classList.remove('drag-over');
        });
        
        // Clean up drag-over class on drop/end
        el.addEventListener('drop', (e) => {
            e.preventDefault();
            el.classList.remove('drag-over');
        });

        gridElement.insertBefore(el, addBtnElement);
    });
}

export function createShortcutElement(shortcut, onDelete, onEdit) {
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

    // Edit Button
    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>';
    div.appendChild(editBtn);

    editBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        onEdit(shortcut);
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.dataset.id = shortcut.id;
    deleteBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
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

export function applyScale(settings) {
    const root = document.documentElement;
    if (settings.cardScale) {
        root.style.setProperty('--card-scale', settings.cardScale);
    }
    if (settings.clockScale) {
        root.style.setProperty('--clock-scale', settings.clockScale);
    }
}

export function openModal(modal) {
    modal.classList.remove('hidden');
}

export function closeModal(modal) {
    modal.classList.add('hidden');
}
