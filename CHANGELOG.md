# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Custom hooks architecture** for better separation of concerns:
  - `useChartUrl`: Handles API URL construction with preset/custom parameter logic
  - `useChartDimensions`: Calculates chart dimensions based on visual parameters
  - `useChartUI`: Comprehensive hook managing all UI state and logic
- **Intelligent Grid Only mode**: Automatically disables related controls (Show Months, Show Days, Show Scale, Show Username) when Grid Only is activated to match API functionality
- **TypeScript interfaces** for better type safety (`ChartParams`, `ChartDimensionsParams`, `ChartDimensions`)
- **Dedicated hooks folder** with organized structure and documentation
- **Preset unification**: Consolidated PRESETS and PRESETS_UI into single source of truth in `lib/presets.ts`
- **Next.js Image configuration**: Added `images.localPatterns` to allow API routes with query strings, fixing local image loading issues

### Changed
- **UI component refactoring**: Main page component reduced from 350+ lines to ~250 lines using custom hooks
- **State management improvement**: Moved from inline state logic to organized hook-based architecture
- **Import structure**: Direct imports from dedicated hooks folder for better maintainability

### Fixed
- **Next.js Image localPatterns error**: Resolved "Image with src ... is using a query string which is not configured" error by adding proper image configuration

### Technical
- Added shadcn/ui Slider component for numeric controls
- Enhanced URL parameter handling for new customization options
- Improved SVG rendering with accurate dimensions