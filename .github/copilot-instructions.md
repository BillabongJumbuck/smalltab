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
  - `scripts/storage.js`: Wrappers for `chrome.storage.local`.
  - `scripts/i18n.js`: Internationalization helpers (`localizeHtml`, `getMessage`).
  - `scripts/search.js`: Search engine logic (Google, Bing, Baidu).
  - `scripts/utils.js`: Utility functions (e.g., URL parsing).
- **CSS (Modular)**:
  - `styles/main.css`: Global layout, typography, background.
  - `styles/grid.css`: Shortcut grid layout.
  - `styles/modal.css`: Settings and Add Shortcut modals.
  - `styles/search.css`: Search bar styling.
- **Localization**: `_locales/{en,zh_CN}/messages.json`.

## Data Persistence
- **Storage**: Uses `chrome.storage.local`.
- **Schema**:
  - `shortcuts`: Array of `{ id, title, url, iconUrl }`.
  - `settings`: Object `{ backgroundImage, searchEngine }`.

## Key Features & Patterns
1.  **Smart Icons**:
    - Try user-provided URL -> Clearbit Logo API -> Google Favicon API (fallback).
    - Implemented in `scripts/ui.js` using `img.onerror` handlers.
2.  **UI/UX Design**:
    - **Glassmorphism**: Extensive use of `backdrop-filter: blur()`, semi-transparent backgrounds, and subtle borders.
    - **SVG Icons**: All icons are inline SVGs (no external font libraries like FontAwesome) for zero-dependency and crisp rendering.
    - **Animations**: CSS transitions for hover states, modal fade-in/scale-up, and dropdown slide effects.
    - **Custom Components**: Replaced native `<select>` and `<input type="file">` with custom styled HTML/CSS/JS components for visual consistency.
3.  **Internationalization (i18n)**:
    - HTML elements use `data-i18n`, `data-i18n-placeholder`, `data-i18n-aria`.
    - `scripts/i18n.js` handles replacement on load.
    - JS strings use `chrome.i18n.getMessage()`.
4.  **Search**:
    - Supports multiple engines (Google, Bing, Baidu).
    - Custom dropdown UI implemented in `scripts/search.js`.
    - Google search appends `&ie=UTF-8`.

## Development Workflow
1.  **Testing**: Load unpacked in `chrome://extensions/`.
2.  **Reloading**: Click refresh in extensions page after JS/JSON changes.
3.  **CSP Compliance**: NO inline event handlers (`onclick="..."`) in HTML. Use `addEventListener`.

## Coding Conventions
- **Modules**: Use `import`/`export`. `smalltab.html` uses `<script type="module">`.
- **CSS**: Maintain modular separation.
- **i18n**: All user-facing text MUST be in `messages.json`.
