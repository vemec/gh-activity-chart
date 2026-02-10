# GitHub Activity Chart Generator

A customizable GitHub contribution chart generator that creates beautiful SVG/PNG charts showing your GitHub activity over the past year.

## Features

- 🎨 **Multiple Themes**: Choose from 15+ built-in themes (github, github-dark, dracula, monokai, etc.)
- 🎨 **Custom Colors**: Specify any hex color to generate a custom color scale
- 📏 **Flexible Sizing**: Control cell size, border radius, gaps, and margins
- 📅 **Customizable Layout**: Show/hide months, days, and footer
- 🖼️ **Multiple Formats**: Generate SVG or PNG output
- ⚡ **Fast API**: Built with Next.js for optimal performance

## API Usage

### Basic Usage

```
GET /api/chart/{username}
```

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `username` | string | - | GitHub username (required) |
| `theme` | string | `github` | Theme: `github`, `github-dark`, `dracula`, `monokai`, `gruvbox`, etc. |
| `color` | string | - | Custom hex color (e.g., `ff6b6b` or `#ff6b6b`) - overrides theme |
| `format` | string | `svg` | Output format: `svg` or `png` |
| `bg` | boolean | `true` | Show white background (SVG only) |
| `size` | number | `10` | Cell size in pixels |
| `radius` | number | `2` | Cell border radius (0-5) |
| `gap` | number | `2` | Gap between cells (0-5) |
| `margin` | number | `20` | Chart margin (0-100) |
| `months` | boolean | `false` | Show month labels |
| `days` | boolean | `false` | Show day labels |
| `footer` | boolean | `true` | Show contribution scale footer |
| `preset` | string | - | Use preset: `minimal`, `compact`, `classic`, `modern`, `full` |

### Examples

#### Basic Chart
```
http://localhost:3000/api/chart/octocat
```

#### Custom Color
```
http://localhost:3000/api/chart/octocat?color=ff6b6b
```

#### Dark Theme with Custom Settings
```
http://localhost:3000/api/chart/octocat?theme=github-dark&size=12&radius=3&gap=1&months=true
```

#### Transparent Background
```
http://localhost:3000/api/chart/octocat?bg=false
```

#### Minimal Preset (no background)
```
http://localhost:3000/api/chart/octocat?preset=minimal
```

#### PNG Output
```
http://localhost:3000/api/chart/octocat?format=png&color=3498db&size=8
```

### Color Parameter

When you specify a `color` parameter, the system automatically generates a 5-level color scale:

1. **Level 0**: Very light gray (`#ebedf0`) - No contributions
2. **Level 1**: Very light tint of your color (15% opacity)
3. **Level 2**: Light tint of your color (30% opacity)
4. **Level 3**: Medium tint of your color (60% opacity)
5. **Level 4**: Your base color (100% opacity) - Most contributions

### Background Parameter

The `bg` parameter controls whether the SVG has a white background:

- `bg=true` (default): SVG includes `style="background-color: white;"`
- `bg=false`: SVG has no background styling (transparent)

**Note:** This parameter only affects SVG output. PNG files always have a white background.

## Development

### Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)

### Project Structure

- `app/api/chart/[username]/route.ts` - Main API endpoint
- `lib/renderer.ts` - Chart rendering logic
- `lib/github.ts` - GitHub API integration
- `components/` - React components for the UI

## Built With

- [Next.js](https://next.js.org) - React framework
- [Sharp](https://sharp.pixelplumbing.com) - Image processing
- [TypeScript](https://www.typescriptlang.org) - Type safety
