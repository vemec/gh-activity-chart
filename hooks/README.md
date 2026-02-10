/**
 * Hooks para la gestión de gráficos de GitHub
 *
 * Esta carpeta contiene hooks personalizados para manejar la lógica
 * relacionada con los gráficos de actividad de GitHub.
 *
 * Estructura:
 * - types.ts: Definiciones de tipos TypeScript
 * - useChartUrl.ts: Hook para construir URLs de la API
 * - useChartDimensions.ts: Hook para calcular dimensiones del gráfico
 * - useChartUI.ts: Hook para manejar estado y lógica completa de la UI
 *
 * Funcionalidades especiales:
 * - Grid Only Mode: Cuando se activa "Grid Only", automáticamente se deshabilitan
 *   los controles de "Show Months", "Show Days", "Show Scale" y "Show Username"
 *   ya que estos elementos no se muestran en el modo grid-only.
 *
 * Importaciones directas:
 * import { useChartUrl } from "@/hooks/useChartUrl"
 * import { useChartDimensions } from "@/hooks/useChartDimensions"
 * import { useChartUI } from "@/hooks/useChartUI"
 * import { type ChartParams } from "@/hooks/types"
 */