import { type PresetKey } from "../lib/presets"
import { type ThemeName, type ThemeMode } from "../lib/themes"

export interface ChartParams {
  username: string
  theme: ThemeName
  mode: ThemeMode
  format: string
  bg: boolean
  onlyGrid: boolean
  showMonths: boolean
  showDays: boolean
  showScale: boolean
  showUsername: boolean
  margin: number[]
  radius: number[]
  gap: number[]
  size: number[]
  color: string
  selectedPreset: PresetKey | "custom"
}
