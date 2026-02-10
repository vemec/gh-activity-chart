import { type PresetKey } from "../lib/presets"
import { type ThemeName } from "../lib/themes"

export interface ChartParams {
  username: string
  theme: ThemeName
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

export interface ChartDimensionsParams {
  size: number[]
  gap: number[]
  margin: number[]
  showDays: boolean
  onlyGrid: boolean
  showScale: boolean
  showUsername: boolean
  showMonths: boolean
}

export interface ChartDimensions {
  width: number
  height: number
}