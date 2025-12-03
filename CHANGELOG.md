# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2025-12-03

### Added
- **Search Functionality**: Integrated search bar with support for Google, Bing, and Baidu.
- **Custom Dropdown**: Replaced native browser `<select>` with a custom glassmorphism dropdown for search engine selection.
- **SVG Icons**: Replaced all Emojis with high-quality inline SVG icons (Settings, Search, Add, Delete, Chevron, Upload).
- **Animations**: Added smooth Fade-In and Scale-Up animations for modals and dropdowns.
- **Interaction Feedback**: Added "sink" (scale down) effects on click and hover glow effects for better tactile feel.

### Changed
- **UI Overhaul**: Implemented a global "Glassmorphism" design language (frosted glass effect).
- **Shortcuts Grid**: Enhanced card styling with semi-transparent backgrounds, borders, and soft shadows.
- **File Upload**: Replaced the native file input with a styled "Browse..." button area.
- **Z-Index Fix**: Fixed an issue where the search dropdown was clipped by the shortcut grid.
- **Refactoring**: Modularized CSS into `search.css`, `grid.css`, `modal.css`.

### Fixed
- **CSP Compliance**: Ensured all event handlers are attached via `addEventListener` in JS, removing inline HTML handlers.
- **Icon Loading**: Improved fallback logic for shortcut icons (User -> Clearbit -> Google Favicon).

## [1.0.0] - 2025-12-03

### Initial Release
- Basic shortcut management (Add, Delete, Persist).
- Custom background image support (URL or Local Upload).
- Internationalization support (English & Simplified Chinese).
- Manifest V3 compliance.
