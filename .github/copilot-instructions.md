# Small Tab - Chrome Extension Instructions

## Project Overview
"Small Tab" is a lightweight Chrome Extension (Manifest V3) that overrides the browser's New Tab page. It provides a customizable grid of quick access shortcuts, search functionality, and custom backgrounds.

## Tech Stack
- **Core**: Vanilla HTML5, CSS3, JavaScript (ES Modules).
- **Frameworks**: None. No build tools (Webpack, Vite).
- **Platform**: Chrome Extension API (Manifest V3).

## Architecture & File Structure
- **Entry Point**: `smalltab.html` (New Tab page).
- **JavaScript (ES Modules)**:
  - `scripts/main.js`: Entry point, initialization, and event wiring.
  - `scripts/ui.js`: DOM manipulation, rendering grid, modals, and background.
  - `scripts/storage.js`: Wrappers for `chrome.storage.local` and Import/Export logic.
  - `scripts/i18n.js`: Internationalization helpers (`localizeHtml`, `getMessage`).
  - `scripts/search.js`: Search engine logic (Google, Bing, Baidu) and custom dropdown UI.
  - `scripts/clock.js`: Clock and greeting logic.
  - `scripts/utils.js`: Utility functions (e.g., URL parsing).
- **CSS (Modular)**:
  - `styles/main.css`: Global layout, typography, background.
  - `styles/grid.css`: Shortcut grid layout.
  - `styles/modal.css`: Settings and Add Shortcut modals.
  - `styles/search.css`: Search bar styling.
  - `styles/clock.css`: Clock component styling.
- **Localization**: `_locales/{en,zh_CN}/messages.json`.

## Data Persistence
- **Storage**: Uses `chrome.storage.local`.
- **Schema**:
  - `shortcuts`: Array of `{ id, title, url, iconUrl }`.
  - `settings`: Object `{ backgroundImage, searchEngine }`.
- **Backup/Restore**:
  - `exportData()`: Generates a JSON blob and triggers a download.
  - `importData(file)`: Reads a JSON file and updates `chrome.storage.local`.

## Key Features & Patterns
1.  **Smart Icons (`scripts/ui.js`)**:
    - **Strategy**: User-provided URL -> Clearbit Logo API -> Google Favicon API (fallback).
    - **Implementation**: Uses `img.addEventListener('error', ...)` to handle fallbacks dynamically.
    - **Code**: `const googleFavicon = 'https://www.google.com/s2/favicons?domain=${domain}&sz=128';`
2.  **UI/UX Design**:
    - **Glassmorphism**: Extensive use of `backdrop-filter: blur()`, semi-transparent backgrounds.
    - **SVG Icons**: Inline SVGs for zero-dependency and crisp rendering.
    - **Custom Components**:
        - **Dropdown**: Implemented in `scripts/search.js` (replacing native `<select>`) for styling control.
        - **File Input**: Custom styled wrapper for image upload.
3.  **Internationalization (i18n)**:
    - **HTML Attributes**: `data-i18n`, `data-i18n-placeholder`, `data-i18n-aria`.
    - **Logic**: `scripts/i18n.js` iterates these attributes and calls `chrome.i18n.getMessage()`.
    - **Constraint**: All user-facing text MUST be in `messages.json`.
4.  **Search**:
    - Supports multiple engines (Google, Bing, Baidu).
    - Google search appends `&ie=UTF-8`.

## Development Workflow
1.  **Testing**: Load unpacked in `chrome://extensions/`.
2.  **Reloading**: Click refresh in extensions page after JS/JSON changes.
3.  **CSP Compliance**: NO inline event handlers (`onclick="..."`) in HTML. Use `addEventListener` in JS modules.
4.  **Debugging**: Use Chrome DevTools on the New Tab page. `console.log` works as expected.

## Coding Conventions
- **Modules**: Use `import`/`export`. `smalltab.html` uses `<script type="module">`.
- **CSS**: Maintain modular separation.
- **i18n**: Always use `chrome.i18n.getMessage` for strings.
