import { useMemo } from "react"
import { type ChartDimensionsParams, type ChartDimensions } from "./types"

/**
 * Hook para calcular las dimensiones del gráfico
 *
 * @param params - Parámetros de configuración visual del gráfico
 * @returns Objeto con width y height calculados
 */
export function useChartDimensions(params: ChartDimensionsParams): ChartDimensions {
  const { size, gap, margin, showDays, onlyGrid, showScale, showUsername, showMonths } = params

  return useMemo(() => {
    const cellSize = size[0]
    const cellGap = gap[0]
    const chartMargin = margin[0]

    // GitHub charts typically show 53 weeks (52-53 weeks in a year)
    const weeksCount = 53

    const labelSpaceLeft = showDays ? 30 : 0
    const scaleSpace = (!onlyGrid && showScale) ? 20 : 0
    const usernameSpace = (!onlyGrid && showUsername) ? 20 : 0
    const monthsSpace = showMonths ? 20 : 0

    const width = weeksCount * (cellSize + cellGap) + (chartMargin * 2) + labelSpaceLeft
    const height = 7 * cellSize + 6 * cellGap + (chartMargin * 2) + scaleSpace + usernameSpace + monthsSpace

    return { width, height }
  }, [size, gap, margin, showDays, onlyGrid, showScale, showUsername, showMonths])
}