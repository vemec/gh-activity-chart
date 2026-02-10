import { useMemo } from "react"
import { type ChartParams } from "./types"

/**
 * Hook para construir la URL de la API del gráfico
 *
 * @param params - Parámetros de configuración del gráfico
 * @returns URL completa para la API del gráfico
 */
export function useChartUrl(params: ChartParams): string {
  const {
    username,
    theme,
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
  } = params

  return useMemo(() => {
    // If using a preset, use preset parameter for cleaner URL
    if (selectedPreset !== "custom") {
      const urlParams = new URLSearchParams({
        preset: selectedPreset,
        theme,
        format,
      })
      return `/api/chart/${username}?${urlParams.toString()}`
    }

    // Otherwise use individual parameters
    const urlParams = new URLSearchParams({
      format,
      theme,
      bg: bg.toString(),
      grid: onlyGrid.toString(),
      months: showMonths.toString(),
      days: showDays.toString(),
      scale: showScale.toString(),
      username: showUsername.toString(),
      margin: margin[0].toString(),
      radius: radius[0].toString(),
      gap: gap[0].toString(),
      size: size[0].toString(),
      ...(color && { color }),
    })
    return `/api/chart/${username}?${urlParams.toString()}`
  }, [
    username,
    theme,
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
  ])
}