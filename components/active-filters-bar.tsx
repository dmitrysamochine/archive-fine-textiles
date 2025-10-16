"use client"

import { X } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { client } from "@/sanity/lib/client"

interface ActiveFilter {
  category: string
  value: string
  label: string
}

interface ActiveFiltersBarProps {
  filterOpen: boolean
  activeCategory: string | null
}

export function ActiveFiltersBar({ filterOpen, activeCategory }: ActiveFiltersBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([])
  const [filterLabels, setFilterLabels] = useState<Record<string, string>>({})

  useEffect(() => {
    const fetchLabels = async () => {
      const [collections, colorways, colors, categories] = await Promise.all([
        client.fetch(`*[_type == "fabricCollection"] { "slug": slug.current, name }`),
        client.fetch(`*[_type == "colorway"] { "slug": slug.current, name }`),
        client.fetch(`*[_type == "color"] { "slug": slug.current, name }`),
        client.fetch(`*[_type == "descriptionCategory"] { "slug": slug.current, name }`),
      ])

      const labels: Record<string, string> = {}
      ;[...collections, ...colorways, ...colors, ...categories].forEach((item: any) => {
        labels[item.slug] = item.name
      })

      setFilterLabels(labels)
    }

    fetchLabels()
  }, [])

  useEffect(() => {
    const filters: ActiveFilter[] = []

    const collectionParam = searchParams.get("collection")
    const colorwayParam = searchParams.get("colorway")
    const colorParam = searchParams.get("color")
    const materialParam = searchParams.get("material")
    const categoryParam = searchParams.get("category")

    if (collectionParam) {
      collectionParam.split(",").forEach((value) => {
        filters.push({
          category: "collection",
          value,
          label: filterLabels[value] || value,
        })
      })
    }

    if (colorwayParam) {
      colorwayParam.split(",").forEach((value) => {
        filters.push({
          category: "colorway",
          value,
          label: filterLabels[value] || value,
        })
      })
    }

    if (colorParam) {
      colorParam.split(",").forEach((value) => {
        filters.push({
          category: "color",
          value,
          label: filterLabels[value] || value,
        })
      })
    }

    if (materialParam) {
      materialParam.split(",").forEach((value) => {
        filters.push({
          category: "material",
          value,
          label: value,
        })
      })
    }

    if (categoryParam) {
      categoryParam.split(",").forEach((value) => {
        filters.push({
          category: "category",
          value,
          label: filterLabels[value] || value,
        })
      })
    }

    setActiveFilters(filters)
  }, [searchParams, filterLabels])

  const removeFilter = (category: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    const currentValues = params.get(category)?.split(",") || []
    const newValues = currentValues.filter((v) => v !== value)

    if (newValues.length > 0) {
      params.set(category, newValues.join(","))
    } else {
      params.delete(category)
    }

    router.push(`/?${params.toString()}`, { scroll: false })
  }

  const clearAll = () => {
    router.push("/", { scroll: false })
  }

  if (activeFilters.length === 0) return null

  const marginLeft = filterOpen ? (activeCategory ? "400px" : "80px") : "0"

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-30 border-b border-border bg-cream-50 transition-all duration-300"
      style={{ marginLeft }}
    >
      <div className="px-6 py-4">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm text-muted-foreground">Active Filters:</span>
          <AnimatePresence mode="popLayout">
            {activeFilters.map((filter) => (
              <motion.button
                key={`${filter.category}-${filter.value}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => removeFilter(filter.category, filter.value)}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-linen-100 hover:bg-linen-200 rounded-sm text-sm transition-colors group"
              >
                <span>{filter.label}</span>
                <X className="h-3 w-3 text-muted-foreground group-hover:text-foreground transition-colors" />
              </motion.button>
            ))}
          </AnimatePresence>
          <button
            onClick={clearAll}
            className="text-sm text-muted-foreground hover:text-foreground underline transition-colors ml-2"
          >
            Clear all
          </button>
        </div>
      </div>
    </motion.div>
  )
}
