# Changelog

All notable changes to this project will be documented in this file.

## [1.3.0] - 2025-12-04

### Added
- **Drag & Drop Sorting**: Users can now reorder shortcuts by dragging and dropping them.
- **Edit Shortcuts**: Added the ability to edit existing shortcuts (Title, URL, Icon).
- **Visual Feedback**: Added visual cues for dragging (opacity change, dashed border) and drop targets.

### Changed
- **UI Improvements**: Moved the edit button to be below the delete button for better accessibility and visual balance.
- **Grid Interaction**: Improved hover states for shortcut cards to accommodate new action buttons.

## [1.2.0] - 2025-12-03

### Added
- **Clock Component**: Added a large, centered digital clock with dynamic greetings (Good Morning/Afternoon/Evening) based on time of day.
- **Data Backup & Restore**: Added functionality to export all settings and shortcuts to a JSON file and import them back.
- **Search Focus Effect**: Implemented a cinematic background blur effect when the search bar is focused.

### Changed
- **Header Layout**: Removed the static "Welcome Back" title in favor of the dynamic clock component.
- **Settings UI**: Added a dedicated "Data Management" section in the settings modal.

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
