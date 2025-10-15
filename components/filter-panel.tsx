"use client"

import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

interface FilterPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function FilterPanel({ isOpen, onClose }: FilterPanelProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Initialize filters from URL
  const [filters, setFilters] = useState({
    collections: [] as string[],
    colorways: [] as string[],
    colors: [] as string[],
    materials: [] as string[],
    categories: [] as string[],
    sort: searchParams.get("sort") || "",
  })

  // Mock data - will be replaced with actual Sanity data
  const filterOptions = {
    collections: ["Heritage Wool", "Linen Blend", "Cotton Classics"],
    colorways: ["Ivory", "Natural", "White"],
    colors: ["White", "Natural", "Ivory", "Black"],
    materials: ["Cotton", "Linen", "Wool", "Silk"],
    categories: ["Upholstery", "Drapery", "Bedding"],
  }

  const handleApply = () => {
    const params = new URLSearchParams()

    if (filters.collections.length) params.set("collection", filters.collections.join(","))
    if (filters.colorways.length) params.set("colorway", filters.colorways.join(","))
    if (filters.colors.length) params.set("color", filters.colors.join(","))
    if (filters.materials.length) params.set("material", filters.materials.join(","))
    if (filters.categories.length) params.set("category", filters.categories.join(","))
    if (filters.sort) params.set("sort", filters.sort)

    router.push(`/?${params.toString()}`)
    onClose()
  }

  const handleClear = () => {
    setFilters({
      collections: [],
      colorways: [],
      colors: [],
      materials: [],
      categories: [],
      sort: "",
    })
    router.push("/")
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 z-40 top-[73px]"
          />

          {/* Filter Panel */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[73px] left-0 right-0 z-50 bg-background border-b border-border shadow-lg"
          >
            <div className="container mx-auto px-6 py-6">
              <div className="flex items-start justify-between mb-6">
                <h3 className="text-lg font-heading">Filter Fabrics</h3>
                <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-6">
                {/* Collection Filter */}
                <FilterSection
                  title="Collection"
                  options={filterOptions.collections}
                  selected={filters.collections}
                  onChange={(collections) => setFilters({ ...filters, collections })}
                />

                {/* Colorway Filter */}
                <FilterSection
                  title="Colorway"
                  options={filterOptions.colorways}
                  selected={filters.colorways}
                  onChange={(colorways) => setFilters({ ...filters, colorways })}
                />

                {/* Color Filter */}
                <FilterSection
                  title="Color"
                  options={filterOptions.colors}
                  selected={filters.colors}
                  onChange={(colors) => setFilters({ ...filters, colors })}
                />

                {/* Material Filter */}
                <FilterSection
                  title="Material"
                  options={filterOptions.materials}
                  selected={filters.materials}
                  onChange={(materials) => setFilters({ ...filters, materials })}
                />

                {/* Category Filter */}
                <FilterSection
                  title="Category"
                  options={filterOptions.categories}
                  selected={filters.categories}
                  onChange={(categories) => setFilters({ ...filters, categories })}
                />
              </div>

              {/* Sort */}
              <div className="mb-6">
                <label className="text-sm font-medium mb-2 block">Sort By</label>
                <select
                  value={filters.sort}
                  onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                  className="px-3 py-2 bg-muted/50 border border-border rounded-md text-sm"
                >
                  <option value="">Default</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="price-low">Price: Low to High</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4">
                <button
                  onClick={handleApply}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90 transition-colors"
                >
                  Apply Filters
                </button>
                <button onClick={handleClear} className="px-6 py-2 text-sm hover:text-accent transition-colors">
                  Clear All
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function FilterSection({
  title,
  options,
  selected,
  onChange,
}: {
  title: string
  options: string[]
  selected: string[]
  onChange: (selected: string[]) => void
}) {
  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((s) => s !== option))
    } else {
      onChange([...selected, option])
    }
  }

  return (
    <div>
      <label className="text-sm font-medium mb-2 block">{title}</label>
      <div className="space-y-2">
        {options.map((option) => (
          <label key={option} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={() => toggleOption(option)}
              className="rounded border-border"
            />
            <span className="text-sm">{option}</span>
          </label>
        ))}
      </div>
    </div>
  )
}
