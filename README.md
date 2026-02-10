# GitHub Activity Chart Generator

A customizable GitHub contribution chart generator that creates beautiful SVG/PNG charts showing your GitHub activity over the past year.

## Features

- 🎨 **15+ Themes**: From classic GitHub to modern dark themes
- 🎨 **Custom Colors**: Use any hex color to create custom color scales
- 📏 **Flexible Layout**: Control size, spacing, and visual elements
- 📅 **Smart Presets**: Pre-configured styles for common use cases
- 🖼️ **Multiple Formats**: SVG and PNG output
- ⚡ **Fast API**: Built with Next.js for optimal performance

## Quick Start

### Basic Usage
```
GET /api/chart/{username}
```

### With Parameters
```
GET /api/chart/{username}?theme=github-dark&preset=minimal&color=ff6b6b
```

## API Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `username` | string | - | GitHub username (required) |
| `theme` | string | `github` | Theme name (github, github-dark, dracula, etc.) |
| `color` | string | - | Custom hex color (e.g., `ff6b6b`) |
| `format` | string | `svg` | Output format: `svg` or `png` |
| `preset` | string | - | Preset configuration (minimal, classic, etc.) |
| `bg` | boolean | `true` | White background (SVG only) |
| `size` | number | 10 | Cell size in pixels (1-20) |
| `radius` | number | 2 | Cell border radius (0-10) |
| `gap` | number | 2 | Gap between cells (0-5) |
| `margin` | number | 20 | Chart margin (0-100) |
| `months` | boolean | `true` | Show month labels |
| `days` | boolean | `true` | Show day labels |
| `scale` | boolean | `true` | Show contribution scale |
| `username` | boolean | `true` | Show username |
| `grid` | boolean | `false` | Grid-only mode (hides axes) |
| `year` | number | current | Specific year (2008-current) |

## Presets

Pre-configured visual settings. See `/lib/presets.ts` for complete list.

| Preset | Description |
|--------|-------------|
| `minimal` | Clean grid-only design |
| `classic` | Traditional style with months |
| `modern` | Contemporary design |
| `full` | Complete chart with all elements |

## Examples

### Basic Chart
```
http://localhost:3000/api/chart/octocat
```

### Dark Theme
```
http://localhost:3000/api/chart/octocat?theme=github-dark&preset=minimal
```

### Custom Color PNG
```
http://localhost:3000/api/chart/octocat?format=png&color=3498db&size=12
```

## Error Responses

- **400 Bad Request**: Invalid parameters or username
- **404 Not Found**: GitHub user not found
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server error

## Development

### Setup
```bash
npm install
npm run dev
```

### Project Structure
- `app/api/chart/[username]/route.ts` - Main API endpoint
- `lib/renderer.ts` - Chart rendering logic
- `lib/github.ts` - GitHub API integration
- `hooks/` - Custom React hooks
- `components/` - UI components

## Built With

- [Next.js](https://next.js.org) - React framework
- [Sharp](https://sharp.pixelplumbing.com) - Image processing
- [TypeScript](https://www.typescriptlang.org) - Type safety
