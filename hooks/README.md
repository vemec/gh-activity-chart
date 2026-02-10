/**
 * Hooks for GitHub chart management
 *
 * This folder contains custom hooks to handle logic
 * related to GitHub activity charts.
 *
 * Structure:
 * - types.ts: TypeScript type definitions
 * - useChartUrl.ts: Hook for building API URLs
 * - useChartDimensions.ts: Hook for calculating chart dimensions
 * - useChartUI.ts: Hook for managing complete UI state and logic
 *
 * Special features:
 * - Grid Only Mode: When "Grid Only" is activated, it automatically disables
 *   the "Show Months", "Show Days", "Show Scale" and "Show Username" controls
 *   since these elements are not displayed in grid-only mode.
 *
 * Direct imports:
 * import { useChartUrl } from "@/hooks/useChartUrl"
 * import { useChartDimensions } from "@/hooks/useChartDimensions"
 * import { useChartUI } from "@/hooks/useChartUI"
 * import { type ChartParams } from "@/hooks/types"
 */