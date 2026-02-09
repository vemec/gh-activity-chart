"use client"

import { useState, useMemo } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"

// Preset configurations for UI
const PRESETS = {
  minimal: {
    name: "Minimal",
    description: "Solo grid, sin elementos extra",
    theme: "github",
    bg: false,
    onlyGrid: true,
    margin: 5,
    radius: 2,
    gap: 1,
    showMonths: false,
    showDays: false,
    showFooter: false,
  },
  compact: {
    name: "Compact",
    description: "Grid compacto con fondo oscuro",
    theme: "github-dark",
    bg: true,
    onlyGrid: true,
    margin: 10,
    radius: 1,
    gap: 1,
    showMonths: false,
    showDays: false,
    showFooter: false,
  },
  classic: {
    name: "Classic",
    description: "Estilo clásico con meses",
    theme: "classic",
    bg: true,
    onlyGrid: false,
    margin: 20,
    radius: 2,
    gap: 2,
    showMonths: true,
    showDays: false,
    showFooter: true,
  },
  modern: {
    name: "Modern",
    description: "Estilo moderno con días",
    theme: "modern",
    bg: true,
    onlyGrid: false,
    margin: 20,
    radius: 3,
    gap: 2,
    showMonths: false,
    showDays: true,
    showFooter: true,
  },
  full: {
    name: "Full",
    description: "Todo activado",
    theme: "github",
    bg: true,
    onlyGrid: false,
    margin: 25,
    radius: 2,
    gap: 2,
    showMonths: true,
    showDays: true,
    showFooter: true,
  },
  dark: {
    name: "Dark",
    description: "Tema oscuro completo",
    theme: "github-dark",
    bg: true,
    onlyGrid: false,
    margin: 20,
    radius: 2,
    gap: 2,
    showMonths: true,
    showDays: false,
    showFooter: true,
  },
  coder: {
    name: "Coder",
    description: "Tema coder con Dracula",
    theme: "dracula",
    bg: true,
    onlyGrid: false,
    margin: 20,
    radius: 2,
    gap: 2,
    showMonths: true,
    showDays: false,
    showFooter: true,
  },
} as const;

type PresetKey = keyof typeof PRESETS;

export default function Page() {
  const [username, setUsername] = useState("vemec")
  const [theme, setTheme] = useState("github")
  const [format, setFormat] = useState("svg")
  const [bg, setBg] = useState(true)
  const [onlyGrid, setOnlyGrid] = useState(false)
  const [showMonths, setShowMonths] = useState(false)
  const [showDays, setShowDays] = useState(false)
  const [showFooter, setShowFooter] = useState(true)
  const [margin, setMargin] = useState([20])
  const [radius, setRadius] = useState([2])
  const [gap, setGap] = useState([2])
  const [selectedPreset, setSelectedPreset] = useState<PresetKey | "custom">("custom")

  // Apply preset configuration
  const applyPreset = (presetKey: PresetKey | "custom") => {
    if (presetKey === "custom") {
      setSelectedPreset("custom")
      return
    }

    const preset = PRESETS[presetKey]
    setTheme(preset.theme)
    setBg(preset.bg)
    setOnlyGrid(preset.onlyGrid)
    setMargin([preset.margin])
    setRadius([preset.radius])
    setGap([preset.gap])
    setShowMonths(preset.showMonths)
    setShowDays(preset.showDays)
    setShowFooter(preset.showFooter)
    setSelectedPreset(presetKey)
  }

  // Check if current settings match a preset
  const currentPreset = useMemo(() => {
    for (const [key, preset] of Object.entries(PRESETS)) {
      if (
        theme === preset.theme &&
        bg === preset.bg &&
        onlyGrid === preset.onlyGrid &&
        margin[0] === preset.margin &&
        radius[0] === preset.radius &&
        gap[0] === preset.gap &&
        showMonths === preset.showMonths &&
        showDays === preset.showDays &&
        showFooter === preset.showFooter
      ) {
        return key as PresetKey
      }
    }
    return "custom" as const
  }, [theme, bg, onlyGrid, margin, radius, gap, showMonths, showDays, showFooter])

  // Update selectedPreset when settings change
  useMemo(() => {
    setSelectedPreset(currentPreset)
  }, [currentPreset])

  const chartUrl = useMemo(() => {
    // If using a preset, use preset parameter for cleaner URL
    if (selectedPreset !== "custom") {
      const params = new URLSearchParams({
        preset: selectedPreset,
        format,
      })
      return `/api/chart/${username}?${params.toString()}`
    }

    // Otherwise use individual parameters
    const params = new URLSearchParams({
      format,
      theme,
      bg: bg.toString(),
      grid: onlyGrid.toString(),
      months: showMonths.toString(),
      days: showDays.toString(),
      footer: showFooter.toString(),
      margin: margin[0].toString(),
      radius: radius[0].toString(),
      gap: gap[0].toString(),
    })
    return `/api/chart/${username}?${params.toString()}`
  }, [username, theme, format, bg, onlyGrid, showMonths, showDays, showFooter, margin, radius, gap, selectedPreset])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">GitHub Activity Chart</h1>
          <p className="text-gray-600">Visualiza las contribuciones de GitHub como un gráfico de calor</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Configuración del Gráfico</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username">Usuario de GitHub</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="ej: octocat"
                />
              </div>

              {/* Theme */}
              <div className="space-y-2">
                <Label>Tema</Label>
                <Select value={theme} onValueChange={(value) => value && setTheme(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="github">GitHub</SelectItem>
                    <SelectItem value="github-dark">GitHub Dark</SelectItem>
                    <SelectItem value="classic">Classic</SelectItem>
                    <SelectItem value="modern">Modern</SelectItem>
                    <SelectItem value="nord">Nord</SelectItem>
                    <SelectItem value="solarized">Solarized</SelectItem>
                    <SelectItem value="sunset">Sunset</SelectItem>
                    <SelectItem value="ocean">Ocean</SelectItem>
                    <SelectItem value="dracula">Dracula</SelectItem>
                    <SelectItem value="monokai">Monokai</SelectItem>
                    <SelectItem value="one-dark">One Dark</SelectItem>
                    <SelectItem value="material-dark">Material Dark</SelectItem>
                    <SelectItem value="tokyo-night">Tokyo Night</SelectItem>
                    <SelectItem value="gruvbox">Gruvbox</SelectItem>
                    <SelectItem value="catppuccin">Catppuccin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Format */}
              <div className="space-y-2">
                <Label>Formato</Label>
                <Select value={format} onValueChange={(value) => value && setFormat(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="svg">SVG</SelectItem>
                    <SelectItem value="png">PNG</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Preset */}
              <div className="space-y-2">
                <Label>Preconfiguración</Label>
                <Select value={selectedPreset} onValueChange={(value) => applyPreset(value as PresetKey | "custom")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="custom">Personalizado</SelectItem>
                    {Object.entries(PRESETS).map(([key, preset]) => (
                      <SelectItem key={key} value={key}>
                        {preset.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedPreset !== "custom" && (
                  <p className="text-xs text-gray-500">{PRESETS[selectedPreset].description}</p>
                )}
              </div>

              {/* Margin Slider */}
              <div className="space-y-2">
                <Label>Margen: {margin[0]}px</Label>
                <Slider
                  value={margin}
                  onValueChange={(value) => setMargin(Array.isArray(value) ? value : [value])}
                  max={45}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Radius Slider */}
              <div className="space-y-2">
                <Label>Radio de Celdas: {radius[0]}px</Label>
                <Slider
                  value={radius}
                  onValueChange={(value) => setRadius(Array.isArray(value) ? value : [value])}
                  max={5}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Gap Slider */}
              <div className="space-y-2">
                <Label>Separación de Celdas: {gap[0]}px</Label>
                <Slider
                  value={gap}
                  onValueChange={(value) => setGap(Array.isArray(value) ? value : [value])}
                  max={5}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Switches */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch id="bg" checked={bg} onCheckedChange={setBg} />
                  <Label htmlFor="bg">Fondo</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="grid" checked={onlyGrid} onCheckedChange={setOnlyGrid} />
                  <Label htmlFor="grid">Solo Grid</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="months" checked={showMonths} onCheckedChange={setShowMonths} />
                  <Label htmlFor="months">Mostrar Meses</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="days" checked={showDays} onCheckedChange={setShowDays} />
                  <Label htmlFor="days">Mostrar Días</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="footer" checked={showFooter} onCheckedChange={setShowFooter} />
                  <Label htmlFor="footer">Mostrar Footer</Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gráfico Generado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <img
                src={chartUrl}
                alt="GitHub Activity Chart"
                className="border rounded-lg shadow-lg max-w-full h-auto"
                onError={(e) => {
                  e.currentTarget.src = '/api/placeholder.svg'
                }}
              />
            </div>
            <div className="mt-6 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">URL de la API:</h3>
                <div className="p-3 bg-gray-100 rounded text-sm font-mono break-all">
                  {typeof window !== 'undefined' ? window.location.origin : ''}{chartUrl}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Uso en GitHub (Markdown):</h3>
                <div className="p-3 bg-gray-100 rounded text-sm font-mono break-all">
                  ![GitHub Activity Chart]({typeof window !== 'undefined' ? window.location.origin : ''}{chartUrl})
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Uso en HTML:</h3>
                <div className="p-3 bg-gray-100 rounded text-sm font-mono break-all">
                  &lt;img src="{typeof window !== 'undefined' ? window.location.origin : ''}{chartUrl}" alt="GitHub Activity Chart" /&gt;
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}