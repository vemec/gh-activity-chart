# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Preset configurations** for quick chart setup (independent of theme selection):
  - Minimal: Clean grid-only layout
  - Compact: Compact grid layout
  - Classic: Traditional style with months
  - Modern: Contemporary design with days
  - Full: Complete chart with all elements
  - Dark: Full dark theme experience
  - Coder: Developer-focused layout
- **Independent theme selection** - themes can now be combined with any preset for maximum flexibility
- **Preset parameter support** in API for cleaner URLs
- Format selection dropdown (PNG/SVG) for chart output format
- Radius slider (0-5px) for cell corner rounding customization
- Gap slider (0-5px) for spacing between activity cells
- Enhanced API examples section showing:
  - Current API URL with all parameters
  - GitHub markdown syntax for embedding
  - HTML img tag usage
- Real-time chart updates when adjusting customization controls
- **New classic programmer themes:**
  - Dracula: Popular dark theme with purple/pink accents
  - Monokai: Classic Sublime Text theme
  - One Dark: VS Code's popular dark theme
  - Material Dark: Material Design inspired theme
  - Tokyo Night: Modern dark theme with blue tones
  - Gruvbox: Community favorite with earthy colors
  - Catppuccin: Modern pastel theme

### Fixed
- **Vercel deployment issue**: Removed debug file write operation that caused EROFS errors in production
- Height calculation corrected to remove extra white margin at bottom of generated images
- Proper spacing calculation: 7 rows × cellSize + 6 gaps + margins

### Changed
- **Complete UI translation**: Application fully translated from Spanish to English for better accessibility
- All user-facing text, labels, descriptions, and preset names now in English
- Improved international usability and maintainability

### Technical
- Added shadcn/ui Slider component for numeric controls
- Enhanced URL parameter handling for new customization options
- Improved SVG rendering with accurate dimensions