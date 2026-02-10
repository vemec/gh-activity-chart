"use client"

import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { PRESETS } from "@/lib/presets"
import { THEMES } from "@/lib/themes"
import { useChartUrl } from "@/hooks/useChartUrl"
import { useChartDimensions } from "@/hooks/useChartDimensions"
import { useChartUI } from "@/hooks/useChartUI"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type ThemeName } from "@/lib/themes"
import { type PresetKey } from "@/lib/presets"

export default function Page() {
  const { state, actions, computed } = useChartUI()

  // Use other hooks with computed parameters
  const chartUrl = useChartUrl(computed.chartParams)
  const chartDimensions = useChartDimensions(computed.dimensionsParams)

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">GitHub Activity Chart</h1>
          <p className="text-gray-600">Visualize GitHub contributions as a heat map chart</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Chart Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username">GitHub Username</Label>
                <Input
                  id="username"
                  value={state.username}
                  onChange={(e) => actions.setUsername(e.target.value)}
                  placeholder="e.g: octocat"
                />
              </div>

              {/* Theme */}
              <div className="space-y-2">
                <Label>Theme</Label>
                <Select value={state.theme} onValueChange={(value) => value && actions.setTheme(value as ThemeName)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(THEMES).map((themeKey) => (
                      <SelectItem key={themeKey} value={themeKey}>
                        {themeKey.split('-').map(word =>
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Format */}
              <div className="space-y-2">
                <Label>Format</Label>
                <Select value={state.format} onValueChange={(value) => value && actions.setFormat(value)}>
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
                <Label>Preset</Label>
                <Select value={state.selectedPreset} onValueChange={(value) => actions.applyPreset(value as PresetKey | "custom")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="custom">Custom</SelectItem>
                    {Object.entries(PRESETS).map(([key, preset]) => (
                      <SelectItem key={key} value={key}>
                        {preset.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {state.selectedPreset !== "custom" && (
                  <p className="text-xs text-gray-500">{PRESETS[state.selectedPreset].description}</p>
                )}
              </div>

              {/* Margin Slider */}
              <div className="space-y-2">
                <Label>Margin: {state.margin[0]}px</Label>
                <Slider
                  value={state.margin}
                  onValueChange={(value) => actions.setMargin(Array.isArray(value) ? value : [value])}
                  max={45}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Radius Slider */}
              <div className="space-y-2">
                <Label>Cell Radius: {state.radius[0]}px</Label>
                <Slider
                  value={state.radius}
                  onValueChange={(value) => actions.setRadius(Array.isArray(value) ? value : [value])}
                  max={5}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Gap Slider */}
              <div className="space-y-2">
                <Label>Cell Spacing: {state.gap[0]}px</Label>
                <Slider
                  value={state.gap}
                  onValueChange={(value) => actions.setGap(Array.isArray(value) ? value : [value])}
                  max={5}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Size Slider */}
              <div className="space-y-2">
                <Label>Cell Size: {state.size[0]}px</Label>
                <Slider
                  value={state.size}
                  onValueChange={(value) => actions.setSize(Array.isArray(value) ? value : [value])}
                  max={20}
                  min={6}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Custom Color */}
              <div className="space-y-2">
                <Label htmlFor="color">Custom Color</Label>
                <div className="flex space-x-2">
                  <Input
                    id="color"
                    type="color"
                    value={state.color ? (state.color.startsWith('#') ? state.color : `#${state.color}`) : '#000000'}
                    onChange={(e) => actions.setColor(e.target.value.slice(1))} // Remove # prefix
                    className="w-16 h-10 p-1 border rounded"
                  />
                  <Input
                    type="text"
                    placeholder="e.g. ff6b6b"
                    value={state.color}
                    onChange={(e) => actions.setColor(e.target.value.replace('#', ''))}
                    className="flex-1"
                  />
                  {state.color && (
                    <button
                      onClick={() => actions.setColor('')}
                      className="px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-500">Hex color without # (overrides theme)</p>
              </div>

              {/* Switches */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch id="bg" checked={state.bg} onCheckedChange={actions.setBg} />
                  <Label htmlFor="bg">Background</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="grid" checked={state.onlyGrid} onCheckedChange={actions.setOnlyGrid} />
                  <Label htmlFor="grid">Grid Only</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="months"
                    checked={state.showMonths}
                    onCheckedChange={actions.setShowMonths}
                    disabled={state.onlyGrid}
                  />
                  <Label htmlFor="months" className={state.onlyGrid ? "text-gray-400" : ""}>
                    Show Months {state.onlyGrid && "(disabled in grid mode)"}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="days"
                    checked={state.showDays}
                    onCheckedChange={actions.setShowDays}
                    disabled={state.onlyGrid}
                  />
                  <Label htmlFor="days" className={state.onlyGrid ? "text-gray-400" : ""}>
                    Show Days {state.onlyGrid && "(disabled in grid mode)"}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="scale"
                    checked={state.showScale}
                    onCheckedChange={actions.setShowScale}
                    disabled={state.onlyGrid}
                  />
                  <Label htmlFor="scale" className={state.onlyGrid ? "text-gray-400" : ""}>
                    Show Scale {state.onlyGrid && "(disabled in grid mode)"}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="username"
                    checked={state.showUsername}
                    onCheckedChange={actions.setShowUsername}
                    disabled={state.onlyGrid}
                  />
                  <Label htmlFor="username" className={state.onlyGrid ? "text-gray-400" : ""}>
                    Show Username {state.onlyGrid && "(disabled in grid mode)"}
                  </Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Generated Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <Image
                src={chartUrl}
                alt="GitHub Activity Chart"
                width={chartDimensions.width}
                height={chartDimensions.height}
                className="border rounded-lg shadow-lg max-w-full h-auto"
                unoptimized
                onError={(e) => {
                  e.currentTarget.src = '/api/placeholder.svg'
                }}
              />
            </div>
            <div className="mt-6 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">API URL:</h3>
                <div className="p-3 bg-gray-100 rounded text-sm font-mono break-all">
                  {state.origin}{chartUrl}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">GitHub Usage (Markdown):</h3>
                <div className="p-3 bg-gray-100 rounded text-sm font-mono break-all">
                  ![GitHub Activity Chart]({state.origin}{chartUrl})
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">HTML Usage:</h3>
                <div className="p-3 bg-gray-100 rounded text-sm font-mono break-all">
                  &lt;img src=&quot;{state.origin}{chartUrl}&quot; alt=&quot;GitHub Activity Chart&quot; /&gt;
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}