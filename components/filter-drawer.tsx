"use client"

import { X, Search, ChevronRight, ChevronLeft } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { client } from "@/sanity/lib/client"

interface FilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  hasActiveFilters: boolean
}

interface FilterOption {
  name: string
  slug?: string
  hexValue?: string
  count: number
}

type FilterCategory = "collection" | "color" | "material"

const categoryLabels: Record<FilterCategory, string> = {
  collection: "Collection",
  color: "Color",
  material: "Material Content",
}

export function FilterDrawer({ isOpen, onClose, hasActiveFilters }: FilterDrawerProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeCategory, setActiveCategory] = useState<FilterCategory | null>(null)
  const [options, setOptions] = useState<FilterOption[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setSearchQuery("")
  }, [activeCategory])

  useEffect(() => {
    if (activeCategory) {
      fetchOptions()
    }
  }, [activeCategory])

  const fetchOptions = async () => {
    if (!activeCategory) return

    setLoading(true)

    try {
      let data: FilterOption[] = []

      switch (activeCategory) {
        case "collection":
          data = await client.fetch(`*[_type == "fabricCollection"] | order(name asc) {
            name,
            "slug": slug.current,
            "count": count(*[_type == "fabricItem" && references(^._id) && defined(images[0]) && status != "Out of Stock"])
          }`)
          break
        case "color":
          data = await client.fetch(`*[_type == "color"] | order(name asc) {
            name,
            "slug": slug.current,
            hexValue,
            "count": count(*[_type == "fabricItem" && references(^._id) && defined(images[0]) && status != "Out of Stock"])
          }`)
          break
        case "material":
          data = await client.fetch(`*[_type == "material"] | order(name asc) {
            name,
            "slug": slug.current,
            "count": count(*[_type == "fabricItem" && references(^._id) && defined(images[0]) && status != "Out of Stock"])
          }`)
          break
      }

      setOptions(data)
    } catch (error) {
      console.error("Error fetching filter options:", error)
    } finally {
      setLoading(false)
    }
  }

  const selectedValues = searchParams.get(activeCategory || "")?.split(",") || []

  const toggleOption = (value: string) => {
    if (!activeCategory) return

    const params = new URLSearchParams(searchParams.toString())
    const current = params.get(activeCategory)?.split(",") || []
    const updated = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]

    if (updated.length > 0) {
      params.set(activeCategory, updated.join(","))
    } else {
      params.delete(activeCategory)
    }

    router.push(`/?${params.toString()}`, { scroll: false })
  }

  const filteredOptions = options
    .filter((opt) => opt.count > 0)
    .filter((opt) => opt.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const searchable = activeCategory === "collection"

  const handleBack = () => {
    setActiveCategory(null)
  }

  const handleCategoryClick = (category: FilterCategory) => {
    setActiveCategory(category)
  }

  const handleClose = () => {
    setActiveCategory(null)
    onClose()
  }

  const topPosition = hasActiveFilters ? 145 : 80

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/40 z-40"
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{
          x: isOpen ? 0 : "-100%",
          top: topPosition,
        }}
        transition={{
          x: { type: "spring", damping: 30, stiffness: 300 },
          top: { duration: 0.3 },
        }}
        className="fixed left-0 w-80 bg-background border-r border-border z-50 flex flex-col overflow-hidden"
        style={{ height: `calc(100vh - ${topPosition}px)` }}
      >
        {/* Main Menu View */}
        <AnimatePresence mode="wait">
          {!activeCategory ? (
            <motion.div
              key="main-menu"
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col h-full"
            >
              {/* Header */}
              <div className="flex items-center justify-end p-6 border-b border-border">
                <button onClick={handleClose} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Categories */}
              <div className="flex-1 flex flex-col">
                <button
                  onClick={() => handleCategoryClick("collection")}
                  className="flex items-center justify-between px-6 py-5 hover:bg-linen-50 transition-colors border-b border-border group"
                >
                  <span className="text-base font-sans">Collection</span>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </button>

                <button
                  onClick={() => handleCategoryClick("color")}
                  className="flex items-center justify-between px-6 py-5 hover:bg-linen-50 transition-colors border-b border-border group"
                >
                  <span className="text-base font-sans">Color</span>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </button>

                <button
                  onClick={() => handleCategoryClick("material")}
                  className="flex items-center justify-between px-6 py-5 hover:bg-linen-50 transition-colors border-b border-border group"
                >
                  <span className="text-base font-sans">Material</span>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </button>
              </div>
            </motion.div>
          ) : (
            // Detail View
            <motion.div
              key="detail-view"
              initial={{ x: 320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 320, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col h-full"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
                <h3 className="text-base font-sans">{categoryLabels[activeCategory]}</h3>
                <button onClick={handleClose} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Back Button */}
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-6 py-4 border-b border-border hover:bg-linen-50 transition-colors flex-shrink-0"
              >
                <ChevronLeft className="h-5 w-5" />
                <span className="text-sm font-sans">Back</span>
              </button>

              {/* Search (for collection only) */}
              {searchable && (
                <div className="px-6 py-4 border-b border-border flex-shrink-0">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder={`Search ${categoryLabels[activeCategory].toLowerCase()}...`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-muted/50 border border-border rounded-full focus:outline-none focus:ring-1 focus:ring-ring font-sans"
                    />
                  </div>
                </div>
              )}

              {/* Options List */}
              <div className="flex-1 overflow-y-auto px-6 py-4 min-h-0">
                {loading ? (
                  <p className="text-sm text-muted-foreground font-sans">Loading...</p>
                ) : filteredOptions.length === 0 ? (
                  <p className="text-sm text-muted-foreground font-sans">No options found</p>
                ) : (
                  <div className="space-y-2">
                    {filteredOptions.map((option) => {
                      const value = option.slug || option.name
                      const isSelected = selectedValues.includes(value)

                      return (
                        <label key={value} className="flex items-center gap-3 cursor-pointer group py-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleOption(value)}
                            className="rounded border-border text-primary focus:ring-primary"
                          />
                          {option.hexValue && (
                            <span
                              className="w-4 h-4 rounded-full border border-border flex-shrink-0"
                              style={{ backgroundColor: option.hexValue }}
                            />
                          )}
                          <span className="text-sm group-hover:text-foreground transition-colors flex-1 font-sans">
                            {option.name}
                          </span>
                          <span className="text-xs text-muted-foreground font-sans">({option.count})</span>
                        </label>
                      )
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  )
}
