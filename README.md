# Small Tab

A lightweight, customizable Chrome New Tab extension that replaces your default new tab page with a clean, personalized dashboard.

## Features

- 🚀 **Quick Access**: Add your favorite websites as shortcuts.
- 🖼️ **Custom Backgrounds**: Set your wallpaper using a URL or upload a local image.
- ⚡ **Smart Icons**: Automatically fetches high-quality logos for your shortcuts.
- 🌍 **Internationalization**: Supports English and Simplified Chinese (简体中文).
- 🔒 **Privacy Focused**: All data is stored locally in your browser (`chrome.storage.local`). No external servers tracking your data.
- ⚡ **Lightweight**: Built with Vanilla JavaScript (ES Modules), HTML, and CSS. No heavy frameworks.

## Installation

1. Clone or download this repository.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Toggle **Developer mode** in the top right corner.
4. Click **Load unpacked**.
5. Select the folder where you cloned/downloaded this repository.
6. Open a new tab to see it in action!

## Development

### Project Structure

- `manifest.json`: Extension configuration (Manifest V3).
- `smalltab.html`: The main entry point for the new tab page.
- `scripts/`:
  - `main.js`: Entry point, handles initialization and event wiring.
  - `ui.js`: DOM manipulation and rendering logic.
  - `storage.js`: Wrapper for `chrome.storage.local`.
  - `i18n.js`: Internationalization helper functions.
  - `utils.js`: Utility functions.
- `styles/`: CSS styles.
- `_locales/`: Translation files.

### Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](LICENSE)
