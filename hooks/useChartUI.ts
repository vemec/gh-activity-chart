import { useState, useMemo, useEffect } from "react"
import { PRESETS, type PresetKey } from "../lib/presets"
import { type ThemeName, type ThemeMode } from "../lib/themes"
import { type ChartParams } from "./types"

export interface ChartUIState {
  // Basic settings
  username: string
  theme: ThemeName
  mode: ThemeMode
  format: string

  // Visual settings
  bg: boolean
  onlyGrid: boolean
  showMonths: boolean
  showDays: boolean
  showScale: boolean
  showUsername: boolean

  // Size settings
  margin: number[]
  radius: number[]
  gap: number[]
  size: number[]

  // Color settings
  color: string

  // Preset management
  selectedPreset: PresetKey | "custom"

  // Origin for URLs
  origin: string
}

export interface ChartUIActions {
  setUsername: (username: string) => void
  setTheme: (theme: ThemeName) => void
  setMode: (mode: ThemeMode) => void
  setFormat: (format: string) => void
  setBg: (bg: boolean) => void
  setOnlyGrid: (onlyGrid: boolean) => void
  setShowMonths: (showMonths: boolean) => void
  setShowDays: (showDays: boolean) => void
  setShowScale: (showScale: boolean) => void
  setShowUsername: (showUsername: boolean) => void
  setMargin: (margin: number[]) => void
  setRadius: (radius: number[]) => void
  setGap: (gap: number[]) => void
  setSize: (size: number[]) => void
  setColor: (color: string) => void
  applyPreset: (presetKey: PresetKey | "custom") => void
}

export interface ChartUIComputed {
  currentPreset: PresetKey | "custom"
  chartParams: ChartParams
}

/**
 * Hook para manejar toda la lógica de estado de la UI del gráfico
 */
export function useChartUI() {
  // Basic settings
  const [username, setUsername] = useState("vemec")
  const [theme, setTheme] = useState<ThemeName>("github")
  const [mode, setMode] = useState<ThemeMode>("light")
  const [format, setFormat] = useState("svg")

  // Visual settings
  const [bg, setBg] = useState(true)
  const [onlyGrid, setOnlyGrid] = useState(false)
  const [showMonths, setShowMonths] = useState(false)
  const [showDays, setShowDays] = useState(false)
  const [showScale, setShowScale] = useState(true)
  const [showUsername, setShowUsername] = useState(true)

  // Size settings
  const [margin, setMargin] = useState([20])
  const [radius, setRadius] = useState([2])
  const [gap, setGap] = useState([2])
  const [size, setSize] = useState([10])

  // Color settings
  const [color, setColor] = useState("")

  // Preset management
  const [selectedPreset, setSelectedPreset] = useState<PresetKey | "custom">("custom")

  // Origin for URLs
  const [origin, setOrigin] = useState("")

  // Store previous values when grid only is enabled
  const [savedValues, setSavedValues] = useState({
    showMonths: false,
    showDays: false,
    showScale: true,
    showUsername: true,
  })

  // Initialize origin on client side to avoid hydration mismatch
  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  // Handle grid only mode - disable related controls
  useEffect(() => {
    if (onlyGrid) {
      // Save current values before disabling
      setSavedValues({
        showMonths,
        showDays,
        showScale,
        showUsername,
      })
      // Disable all related controls
      setShowMonths(false)
      setShowDays(false)
      setShowScale(false)
      setShowUsername(false)
    } else {
      // Restore saved values when grid only is disabled
      setShowMonths(savedValues.showMonths)
      setShowDays(savedValues.showDays)
      setShowScale(savedValues.showScale)
      setShowUsername(savedValues.showUsername)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onlyGrid]) // Only depend on onlyGrid to avoid infinite loops

  // Apply preset configuration
  const applyPreset = (presetKey: PresetKey | "custom") => {
    if (presetKey === "custom") {
      setSelectedPreset("custom")
      return
    }

    const preset = PRESETS[presetKey]
    setBg(preset.bg)
    setOnlyGrid(preset.grid)
    setMargin([preset.margin])
    setRadius([preset.radius])
    setGap([preset.gap])
    setSize([preset.size || 10])
    setColor("") // No custom color for presets
    // Set the boolean values directly from preset
    setShowMonths(preset.months)
    setShowDays(preset.days)
    setShowScale(preset.scale)
    setShowUsername(preset.username)
    setSelectedPreset(presetKey)
  }

  // Check if current settings match a preset
  const currentPreset = useMemo(() => {
    for (const [key, preset] of Object.entries(PRESETS)) {
      if (
        bg === preset.bg &&
        onlyGrid === preset.grid &&
        margin[0] === preset.margin &&
        radius[0] === preset.radius &&
        gap[0] === preset.gap &&
        size[0] === (preset.size || 10) &&
        color === "" &&
        showMonths === preset.months &&
        showDays === preset.days &&
        showScale === preset.scale &&
        showUsername === preset.username
      ) {
        return key as PresetKey
      }
    }
    return "custom" as const
  }, [bg, onlyGrid, margin, radius, gap, size, color, showMonths, showDays, showScale, showUsername])

  // Update selectedPreset when settings change
  useEffect(() => {
    setSelectedPreset(currentPreset)
  }, [currentPreset])

  // Computed values for other hooks
  const chartParams: ChartParams = {
    username,
    theme,
    mode,
    format,
    bg,
    onlyGrid,
    showMonths,
    showDays,
    showScale,
    showUsername,
    margin,
    radius,
    gap,
    size,
    color,
    selectedPreset,
  }

  const state: ChartUIState = {
    username,
    theme,
    mode,
    format,
    bg,
    onlyGrid,
    showMonths,
    showDays,
    showScale,
    showUsername,
    margin,
    radius,
    gap,
    size,
    color,
    selectedPreset,
    origin,
  }

  const actions: ChartUIActions = {
    setUsername,
    setTheme,
    setMode,
    setFormat,
    setBg,
    setOnlyGrid,
    setShowMonths: (showMonths: boolean) => !onlyGrid && setShowMonths(showMonths),
    setShowDays: (showDays: boolean) => !onlyGrid && setShowDays(showDays),
    setShowScale: (showScale: boolean) => !onlyGrid && setShowScale(showScale),
    setShowUsername: (showUsername: boolean) => !onlyGrid && setShowUsername(showUsername),
    setMargin,
    setRadius,
    setGap,
    setSize,
    setColor,
    applyPreset,
  }

  const computed: ChartUIComputed = {
    currentPreset,
    chartParams,
  }

  return {
    state,
    actions,
    computed,
  }
}