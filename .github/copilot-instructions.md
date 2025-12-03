# Small Tab - Chrome Extension Instructions

## Project Overview
"Small Tab" is a lightweight Chrome Extension (Manifest V3) that overrides the browser's New Tab page. It provides a customizable grid of quick access shortcuts.

## Tech Stack
- **Core**: Vanilla HTML5, CSS3, JavaScript (ES6+).
- **Frameworks**: None. Do not introduce build tools (Webpack, Vite) or frameworks (React, Vue) unless explicitly requested.
- **Platform**: Chrome Extension API (Manifest V3).

## Architecture & Data Flow
- **Entry Point**: `smalltab.html` is the New Tab page.
- **Data Persistence**: Use `chrome.storage.sync` (preferred) or `chrome.storage.local` to save user shortcuts.
  - **Schema**: Store shortcuts as an array of objects: `{ id: string, title: string, url: string, iconUrl: string }`.
- **Styling**: 
  - Located in `styles/main.css`.
  - Uses CSS Grid (`display: grid`) for the `#quick-access-grid` layout.
  - Responsive design using `repeat(auto-fill, minmax(...))` for grid columns.

## Key Components
- **Grid Container**: `<main id="quick-access-grid">` hosts the shortcut items.
- **Add Button**: The element `#add-shortcut` is the trigger for creating new items.
- **Logic**: `scripts/main.js` handles:
  - Loading data from `chrome.storage` on init.
  - Rendering the grid items dynamically.
  - Handling click events for adding/deleting shortcuts.

## Development Workflow
1. **Debugging**: Open `smalltab.html` directly in the browser for UI tweaking, but use the Extension environment for API testing.
2. **Extension Testing**:
   - Go to `chrome://extensions/`.
   - Enable "Developer mode".
   - Click "Load unpacked" and select the project root.
   - Open a new tab to see changes.
   - Reload the extension in `chrome://extensions/` after changing `manifest.json` or background scripts (if added).

## Coding Conventions
- **JavaScript**: Use modern ES6+ syntax (const/let, arrow functions, async/await).
- **CSS**: Keep styles simple and scoped by ID or class. Avoid inline styles.
- **HTML**: Semantic HTML5 tags (`header`, `main`).
- **Security**: strict Content Security Policy (CSP) applies. Avoid `eval()` or inline event handlers (e.g., `onclick="..."`) in HTML. Attach listeners in `main.js`.
