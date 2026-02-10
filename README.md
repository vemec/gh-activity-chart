# GitHub Activity Chart Generator

A customizable GitHub contribution chart generator that creates beautiful SVG/PNG charts showing your GitHub activity over the past year.

## Features

- 🎨 **Multiple Themes**: Choose from 15+ built-in themes (github, github-dark, dracula, monokai, etc.)
- 🎨 **Custom Colors**: Specify any hex color to generate a custom color scale
- 📏 **Flexible Sizing**: Control cell size, border radius, gaps, and margins
- 📅 **Customizable Layout**: Show/hide months, days, scale, and username
- 🖼️ **Multiple Formats**: Generate SVG or PNG output
- ⚡ **Fast API**: Built with Next.js for optimal performance

## API Usage

### Basic Usage

```
GET /api/chart/{username}
```

### Parameters

| Parameter | Type | Default | Range | Description |
|-----------|------|---------|-------|-------------|
| `username` | string | - | - | GitHub username (required, cannot be empty) |
| `theme` | string | `github` | - | Theme: `github`, `github-dark`, `classic`, `modern`, `nord`, `solarized`, `sunset`, `ocean`, `dracula`, `monokai`, `one-dark`, `material-dark`, `tokyo-night`, `gruvbox`, `catppuccin` |
| `color` | string | - | - | Custom hex color (e.g., `ff6b6b` or `#ff6b6b`) - overrides theme |
| `format` | string | `svg` | - | Output format: `svg` or `png` |
| `bg` | boolean | `true` | - | Show white background (SVG only) |
| `size` | number | - | 1-20 | Cell size in pixels |
| `radius` | number | preset | 0-10 | Cell border radius |
| `gap` | number | preset | 0-5 | Gap between cells |
| `margin` | number | preset | 0-100 | Chart margin |
| `months` | boolean | preset | - | Show month labels |
| `days` | boolean | preset | - | Show day labels |
| `scale` | boolean | preset | - | Show contribution scale |
| `username` | boolean | preset | - | Show username |
| `grid` | boolean | preset | - | Show only grid without axes |
| `year` | number | current | 2008-current | Specific year to fetch data for |
| `preset` | string | - | - | Use preset configuration (see `/lib/presets.ts`) |

### Presets

Pre-configured visual settings for common use cases. Presets only define visual properties and do not include color or theme settings. See `/lib/presets.ts` for the complete configuration.

| Preset | Description | Background | Grid | Margin | Radius | Gap | Months | Days | Scale | Username |
|--------|-------------|------------|------|--------|--------|-----|--------|------|-------|----------|
| `minimal` | Clean, minimal design | No | Only grid | 5 | 2 | 1 | No | No | No | No |

**Note:** Presets are defined in `/lib/presets.ts` and can be easily extended or modified.

#### Adding New Presets

To add a new preset, edit `/lib/presets.ts`:

```typescript
export const PRESETS: Record<string, PresetConfig> = {
    minimal: {
        bg: false,
        radius: 2,
        gap: 1,
        size: 10,
        grid: true,
        margin: 5,
        months: false,
        days: false,
        scale: false,
        username: false,
    },
    // Add your new preset here
    custom: {
        bg: true,
        radius: 4,
        gap: 2,
        size: 12,
        grid: false,
        margin: 15,
        months: true,
        days: true,
        footer: true,
    },
} as const;
```

### Examples

#### Basic Chart
```
http://localhost:3000/api/chart/octocat
```

#### Using Presets
```
http://localhost:3000/api/chart/octocat?preset=minimal
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

#### PNG Output
```
http://localhost:3000/api/chart/octocat?format=png&color=3498db&size=8
```

#### Specific Year
```
http://localhost:3000/api/chart/octocat?year=2023
```

### Error Handling

The API provides detailed error responses:

#### 400 Bad Request
- Invalid username (empty or whitespace)
- Invalid preset name
- Invalid parameter values (out of range)

```json
{
  "error": "Invalid preset",
  "message": "Preset 'invalidpreset' not found. Available presets: minimal"
}
```

#### 404 Not Found
- GitHub user not found

```json
{
  "error": "User Not Found",
  "message": "User \"nonexistentuser\" not found",
  "username": "nonexistentuser",
  "timestamp": "2026-02-10T17:52:33.881Z"
}
```

#### 429 Too Many Requests
- GitHub API rate limit exceeded

```json
{
  "error": "Rate Limit Exceeded",
  "message": "API rate limit exceeded. Please try again later.",
  "timestamp": "2026-02-10T17:52:33.881Z"
}
```

#### 500 Internal Server Error
- Server errors or unexpected issues

```json
{
  "error": "Internal Server Error",
  "message": "Failed to generate chart",
  "timestamp": "2026-02-10T17:52:33.881Z"
}
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

### Parameter Validation

The API includes comprehensive input validation:

- **Username**: Required, cannot be empty or whitespace-only
- **Theme**: Must be one of the supported themes
- **Preset**: Must be a valid preset name
- **Numeric parameters**: Enforced minimum and maximum values
- **Boolean parameters**: Accept `true`/`false` strings

Invalid parameters return HTTP 400 with detailed error messages.

### Caching

Charts are cached for 4 hours (14400 seconds) with stale-while-revalidate for optimal performance:

- `Cache-Control: public, max-age=14400, s-maxage=14400, stale-while-revalidate=86400`

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
