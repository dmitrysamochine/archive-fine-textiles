"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronRight, ChevronLeft, Search } from "lucide-react"
import { client } from "@/sanity/lib/client"

interface FilterOption {
  _id: string
  name: string
  slug: { current: string }
  itemCount?: number
}

interface OpenStockFilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  hasActiveFilters: boolean
}

type FilterCategory = "color" | "material" | null

export function OpenStockFilterDrawer({ isOpen, onClose, hasActiveFilters }: OpenStockFilterDrawerProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeCategory, setActiveCategory] = useState<FilterCategory>(null)
  const [colors, setColors] = useState<FilterOption[]>([])
  const [materials, setMaterials] = useState<FilterOption[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  const topPosition = hasActiveFilters ? 145 : 80

  useEffect(() => {
    const fetchFilterOptions = async () => {
      const [colorsData, materialsData] = await Promise.all([
        client.fetch(`
          *[_type == "color" && count(*[_type == "openStockItem" && references(^._id) && defined(images[0].asset)]) > 0] | order(name asc) {
            _id,
            name,
            slug,
            "itemCount": count(*[_type == "openStockItem" && references(^._id) && defined(images[0].asset)])
          }
        `),
        client.fetch(`
          *[_type == "material" && count(*[_type == "openStockItem" && references(^._id) && defined(images[0].asset)]) > 0] | order(name asc) {
            _id,
            name,
            slug,
            "itemCount": count(*[_type == "openStockItem" && references(^._id) && defined(images[0].asset)])
          }
        `),
      ])

      setColors(colorsData)
      setMaterials(materialsData)
    }

    fetchFilterOptions()
  }, [])

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setActiveCategory(null), 300)
    }
  }, [isOpen])

  const toggleFilter = (category: string, slug: string) => {
    const params = new URLSearchParams(searchParams.toString())
    const currentValues = params.get(category)?.split(",").filter(Boolean) || []

    if (currentValues.includes(slug)) {
      const newValues = currentValues.filter((v) => v !== slug)
      if (newValues.length > 0) {
        params.set(category, newValues.join(","))
      } else {
        params.delete(category)
      }
    } else {
      params.set(category, [...currentValues, slug].join(","))
    }

    router.push(`/open-stock?${params.toString()}`, { scroll: false })
  }

  const isFilterActive = (category: string, slug: string) => {
    const values = searchParams.get(category)?.split(",") || []
    return values.includes(slug)
  }

  const getFilteredOptions = (options: FilterOption[]) => {
    if (!searchQuery) return options.filter((o) => (o.itemCount || 0) > 0)
    return options
      .filter((o) => (o.itemCount || 0) > 0)
      .filter((o) => o.name.toLowerCase().includes(searchQuery.toLowerCase()))
  }

  const categories = [
    { id: "color" as const, label: "Color", count: colors.filter((c) => (c.itemCount || 0) > 0).length },
    { id: "material" as const, label: "Material", count: materials.filter((m) => (m.itemCount || 0) > 0).length },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 z-40"
            style={{ top: topPosition }}
          />

          <motion.div
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed left-0 bottom-0 w-80 bg-background border-r border-border z-50 flex flex-col"
            style={{ top: topPosition, height: `calc(100vh - ${topPosition}px)` }}
          >
            <AnimatePresence mode="wait">
              {!activeCategory ? (
                <motion.div
                  key="main-menu"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col h-full"
                >
                  <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
                    <span className="font-sans text-sm tracking-wider">FILTERS</span>
                    <button
                      onClick={onClose}
                      className="p-1 hover:bg-muted rounded transition-colors"
                      aria-label="Close filters"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className="w-full flex items-center justify-between p-4 hover:bg-muted transition-colors border-b border-border"
                      >
                        <span className="font-sans">{category.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{category.count}</span>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="detail-view"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex flex-col h-full"
                >
                  <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
                    <span className="font-sans text-sm tracking-wider">
                      {activeCategory === "color" ? "COLOR" : "MATERIAL"}
                    </span>
                    <button
                      onClick={onClose}
                      className="p-1 hover:bg-muted rounded transition-colors"
                      aria-label="Close filters"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setActiveCategory(null)
                      setSearchQuery("")
                    }}
                    className="flex items-center gap-2 p-4 hover:bg-muted transition-colors border-b border-border flex-shrink-0"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="font-sans text-sm">Back</span>
                  </button>

                  <div className="p-4 border-b border-border flex-shrink-0">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-muted rounded text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto min-h-0">
                    {activeCategory === "color" &&
                      getFilteredOptions(colors).map((color) => (
                        <button
                          key={color._id}
                          onClick={() => toggleFilter("color", color.slug.current)}
                          className={`w-full flex items-center justify-between p-4 hover:bg-muted transition-colors border-b border-border ${
                            isFilterActive("color", color.slug.current) ? "bg-linen-100" : ""
                          }`}
                        >
                          <span className="font-sans">{color.name}</span>
                          <span className="text-sm text-muted-foreground">{color.itemCount}</span>
                        </button>
                      ))}

                    {activeCategory === "material" &&
                      getFilteredOptions(materials).map((material) => (
                        <button
                          key={material._id}
                          onClick={() => toggleFilter("material", material.slug.current)}
                          className={`w-full flex items-center justify-between p-4 hover:bg-muted transition-colors border-b border-border ${
                            isFilterActive("material", material.slug.current) ? "bg-linen-100" : ""
                          }`}
                        >
                          <span className="font-sans">{material.name}</span>
                          <span className="text-sm text-muted-foreground">{material.itemCount}</span>
                        </button>
                      ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
