"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { PRESETS } from "@/lib/presets"
import { THEMES, type ThemeMode } from "@/lib/themes"
import { useChartUrl } from "@/hooks/useChartUrl"
import { useChartUI } from "@/hooks/useChartUI"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type ThemeName } from "@/lib/themes"
import { type PresetKey } from "@/lib/presets"
import { ThemeToggle } from "@/components/theme-toggle"
import { ChartInline } from "@/components/chart-inline"

export default function Page() {
  const { state, actions, computed } = useChartUI()

  // Use other hooks with computed parameters
  const chartUrl = useChartUrl(computed.chartParams)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="inline-block mb-4 px-4 py-1.5 bg-primary/10 dark:bg-primary/20 rounded-full">
            <span className="text-sm font-medium text-primary">Open Source Tool</span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-gray-50 mb-4 tracking-tight">
            GitHub Activity Chart
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Transform your GitHub contributions into beautiful, customizable heat map visualizations
          </p>
        </div>

        {/* Preview */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-100">
          <div className="flex justify-center items-center p-6 bg-white/70 dark:bg-gray-900/60 border border-gray-200/50 dark:border-gray-800/50 rounded-2xl shadow-sm">
            <ChartInline
              username={state.username}
              theme={state.theme}
              mode={state.mode}
              bg={state.bg}
              color={state.color}
              radius={state.radius[0]}
              gap={state.gap[0]}
              size={state.size[0]}
              margin={state.margin[0]}
              onlyGrid={state.onlyGrid}
              showMonths={state.showMonths}
              showDays={state.showDays}
              showScale={state.showScale}
              showUsername={state.showUsername}
              className="rounded-lg shadow-2xl max-w-full h-auto bg-white dark:bg-gray-950 overflow-hidden ring-1 ring-gray-200/50 dark:ring-gray-800/50"
            />
          </div>
        </div>

        {/* Controls */}
        <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-150">
          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-gray-200/50 dark:border-gray-800/50 shadow-lg">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-2xl">Controls</CardTitle>
              <p className="text-sm text-muted-foreground">Tweak layout, colors, and display options</p>
            </CardHeader>
            <CardContent className="space-y-5">
                <div className="space-y-3">
                  <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Basics</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 items-start">
                    <div className="space-y-2 lg:col-span-2">
                      <Label htmlFor="username" className="text-sm font-medium">GitHub Username</Label>
                      <Input
                        id="username"
                        value={state.username}
                        onChange={(e) => actions.setUsername(e.target.value)}
                        placeholder="e.g: octocat"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Preset</Label>
                      <Select value={state.selectedPreset} onValueChange={(value) => actions.applyPreset(value as PresetKey | "custom")}>
                        <SelectTrigger className="w-full">
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
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Appearance</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-start">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Theme</Label>
                      <Select value={state.theme} onValueChange={(value) => value && actions.setTheme(value as ThemeName)}>
                        <SelectTrigger className="w-full">
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
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Mode</Label>
                      <Select value={state.mode} onValueChange={(value) => value && actions.setMode(value as ThemeMode)}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Format</Label>
                      <Select value={state.format} onValueChange={(value) => value && actions.setFormat(value)}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="svg">SVG</SelectItem>
                          <SelectItem value="png">PNG</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="color" className="text-sm font-medium">Custom Color</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="color"
                          type="color"
                          value={state.color ? (state.color.startsWith('#') ? state.color : `#${state.color}`) : '#000000'}
                          onChange={(e) => actions.setColor(e.target.value.slice(1))}
                          className="w-14 h-9 p-1 border rounded"
                        />
                        <Input
                          type="text"
                          placeholder="e.g. ff6b6b"
                          value={state.color}
                          onChange={(e) => actions.setColor(e.target.value.replace('#', ''))}
                          className="flex-1"
                        />
                      </div>
                      <p className="text-xs text-gray-500">Hex without # (overrides theme)</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Layout</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-start">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Margin: <span className="text-primary">{state.margin[0]}px</span></Label>
                      <Slider
                        value={state.margin}
                        onValueChange={(value) => actions.setMargin(Array.isArray(value) ? value : [value])}
                        max={45}
                        min={0}
                        step={1}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Cell Radius: <span className="text-primary">{state.radius[0]}px</span></Label>
                      <Slider
                        value={state.radius}
                        onValueChange={(value) => actions.setRadius(Array.isArray(value) ? value : [value])}
                        max={5}
                        min={0}
                        step={1}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Cell Spacing: <span className="text-primary">{state.gap[0]}px</span></Label>
                      <Slider
                        value={state.gap}
                        onValueChange={(value) => actions.setGap(Array.isArray(value) ? value : [value])}
                        max={5}
                        min={0}
                        step={1}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Cell Size: <span className="text-primary">{state.size[0]}px</span></Label>
                      <Slider
                        value={state.size}
                        onValueChange={(value) => actions.setSize(Array.isArray(value) ? value : [value])}
                        max={20}
                        min={6}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Display</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    <label className="flex items-center gap-2">
                      <Switch id="show-bg" checked={state.bg} onCheckedChange={actions.setBg} />
                      <span className="text-sm">Background</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <Switch id="grid-only" checked={state.onlyGrid} onCheckedChange={actions.setOnlyGrid} />
                      <span className="text-sm">Grid Only</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <Switch
                        id="show-months"
                        checked={state.showMonths}
                        onCheckedChange={actions.setShowMonths}
                        disabled={state.onlyGrid}
                      />
                      <span className={state.onlyGrid ? "text-sm text-gray-400" : "text-sm"}>Show Months</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <Switch
                        id="show-days"
                        checked={state.showDays}
                        onCheckedChange={actions.setShowDays}
                        disabled={state.onlyGrid}
                      />
                      <span className={state.onlyGrid ? "text-sm text-gray-400" : "text-sm"}>Show Days</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <Switch
                        id="show-scale"
                        checked={state.showScale}
                        onCheckedChange={actions.setShowScale}
                        disabled={state.onlyGrid}
                      />
                      <span className={state.onlyGrid ? "text-sm text-gray-400" : "text-sm"}>Show Scale</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <Switch
                        id="show-username"
                        checked={state.showUsername}
                        onCheckedChange={actions.setShowUsername}
                        disabled={state.onlyGrid}
                      />
                      <span className={state.onlyGrid ? "text-sm text-gray-400" : "text-sm"}>Show Username</span>
                    </label>
                  </div>
                </div>
                <div className="space-y-4 border-t border-gray-200/70 pt-6 dark:border-gray-800/70">
                  <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Usage</div>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300">API URL</h4>
                      <div className="relative group">
                        <div className="p-3 bg-gray-100 dark:bg-gray-950 rounded-lg text-xs font-mono break-all border border-gray-200 dark:border-gray-800 transition-colors group-hover:border-primary/50">
                          {state.origin}{chartUrl}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300">GitHub/Markdown</h4>
                      <div className="relative group">
                        <div className="p-3 bg-gray-100 dark:bg-gray-950 rounded-lg text-xs font-mono break-all border border-gray-200 dark:border-gray-800 transition-colors group-hover:border-primary/50">
                          ![GitHub Activity Chart]({state.origin}{chartUrl})
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300">HTML</h4>
                      <div className="relative group">
                        <div className="p-3 bg-gray-100 dark:bg-gray-950 rounded-lg text-xs font-mono break-all border border-gray-200 dark:border-gray-800 transition-colors group-hover:border-primary/50">
                          &lt;img src=&quot;{state.origin}{chartUrl}&quot; alt=&quot;GitHub Activity Chart&quot; /&gt;
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            </CardContent>
          </Card>
        </div>

      </div>

      {/* Footer */}
      <footer className="relative mt-24 pt-12 pb-8 border-t border-gray-200/50 dark:border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="text-center sm:text-left">
              <div className="text-sm font-medium text-gray-900 dark:text-gray-50 mb-1">
                GitHub Activity Chart
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Transform your contributions into visual stories
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200/50 dark:border-gray-800/50">
            <p className="text-center text-xs text-gray-500 dark:text-gray-500">
              Made with care for the developer community
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}