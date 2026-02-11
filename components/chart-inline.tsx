"use client"

import { useEffect, useState, useMemo } from "react"
import { generateSVG, SVGOptions } from "@/lib/svg-renderer"
import { ContributionData } from "@/lib/github"

interface ChartInlineProps extends SVGOptions {
  className?: string
}

export function ChartInline(options: ChartInlineProps) {
  const [data, setData] = useState<ContributionData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!options.username) return

    const controller = new AbortController()
    let isMounted = true

    ;(async () => {
      setLoading(true)
      setError(null)

      try {
        const res = await fetch(`/api/data/${options.username}`, { signal: controller.signal })
        if (!res.ok) throw new Error("Failed to fetch contribution data")

        const data = await res.json()
        if (isMounted) {
          setData(data)
          setLoading(false)
        }
      } catch (err) {
        if (isMounted && (err as Error).name !== 'AbortError') {
          setError((err as Error).message)
          setLoading(false)
        }
      }
    })()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [options.username])

  const svgContent = useMemo(() => {
    if (!data) return null
    return generateSVG(data, options)
  }, [data, options])

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center p-8 border rounded-lg bg-gray-50/50 animate-pulse">
        <p className="text-sm text-gray-500">Loading GitHub data...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8 border rounded-lg bg-red-50 text-red-600">
        <p className="text-sm">Error: {error}</p>
      </div>
    )
  }

  if (!svgContent) return null

  return (
    <div 
      className={options.className}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  )
}
