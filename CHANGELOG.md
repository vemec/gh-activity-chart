# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
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
- Height calculation corrected to remove extra white margin at bottom of generated images
- Proper spacing calculation: 7 rows × cellSize + 6 gaps + margins

### Technical
- Added shadcn/ui Slider component for numeric controls
- Enhanced URL parameter handling for new customization options
- Improved SVG rendering with accurate dimensions