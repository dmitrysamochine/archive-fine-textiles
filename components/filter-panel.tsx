"use client"

import { X, Search } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { client } from "@/sanity/lib/client"

interface FilterPanelProps {
  isOpen: boolean
  onClose: () => void
}

interface FilterOptions {
  collections: Array<{ name: string; slug: string; count: number }>
  colorways: Array<{ name: string; slug: string; count: number }>
  colors: Array<{ name: string; slug: string; hexValue?: string; count: number }>
  materials: Array<{ name: string; count: number }>
  categories: Array<{ name: string; slug: string; count: number }>
}

export function FilterPanel({ isOpen, onClose }: FilterPanelProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    collections: [],
    colorways: [],
    colors: [],
    materials: [],
    categories: [],
  })

  const [selectedFilters, setSelectedFilters] = useState({
    collections: searchParams.get("collection")?.split(",") || [],
    colorways: searchParams.get("colorway")?.split(",") || [],
    colors: searchParams.get("color")?.split(",") || [],
    materials: searchParams.get("material")?.split(",") || [],
    categories: searchParams.get("category")?.split(",") || [],
  })

  useEffect(() => {
    const fetchFilterOptions = async () => {
      const [collections, colorways, colors, categories, materials] = await Promise.all([
        client.fetch(`*[_type == "fabricCollection"] | order(name asc) {
          name,
          "slug": slug.current,
          "count": count(*[_type == "fabricItem" && references(^._id)])
        }`),
        client.fetch(`*[_type == "colorway"] | order(name asc) {
          name,
          "slug": slug.current,
          "count": count(*[_type == "fabricItem" && references(^._id)])
        }`),
        client.fetch(`*[_type == "color"] | order(name asc) {
          name,
          "slug": slug.current,
          hexValue,
          "count": count(*[_type == "fabricItem" && references(^._id)])
        }`),
        client.fetch(`*[_type == "descriptionCategory"] | order(name asc) {
          name,
          "slug": slug.current,
          "count": count(*[_type == "fabricItem" && references(^._id)])
        }`),
        client.fetch(`array::unique(*[_type == "fabricItem" && defined(content)].content)`),
      ])

      setFilterOptions({
        collections,
        colorways,
        colors,
        categories,
        materials: materials.map((m: string) => ({ name: m, count: 0 })),
      })
    }

    fetchFilterOptions()
  }, [])

  const updateFilters = (category: keyof typeof selectedFilters, value: string) => {
    const current = selectedFilters[category]
    const updated = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]

    const newFilters = { ...selectedFilters, [category]: updated }
    setSelectedFilters(newFilters)

    // Update URL params immediately
    const params = new URLSearchParams(searchParams.toString())
    if (updated.length > 0) {
      params.set(category === "categories" ? "category" : category.slice(0, -1), updated.join(","))
    } else {
      params.delete(category === "categories" ? "category" : category.slice(0, -1))
    }

    router.push(`/?${params.toString()}`, { scroll: false })
  }

  const clearAll = () => {
    setSelectedFilters({
      collections: [],
      colorways: [],
      colors: [],
      materials: [],
      categories: [],
    })
    router.push("/", { scroll: false })
  }

  const activeFilterCount =
    selectedFilters.collections.length +
    selectedFilters.colorways.length +
    selectedFilters.colors.length +
    selectedFilters.materials.length +
    selectedFilters.categories.length

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed left-0 top-[73px] bottom-0 w-full lg:w-80 bg-background border-r border-border z-50 overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-heading">Filters</h2>
              {activeFilterCount > 0 && (
                <p className="text-xs text-muted-foreground mt-1">{activeFilterCount} active</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {activeFilterCount > 0 && (
                <button
                  onClick={clearAll}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear all
                </button>
              )}
              <button onClick={onClose} className="lg:hidden text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <Accordion type="multiple" className="space-y-4">
            {/* Collection Filter */}
            <FilterAccordion
              title="Collection"
              options={filterOptions.collections}
              selected={selectedFilters.collections}
              onToggle={(value) => updateFilters("collections", value)}
              searchable
            />

            {/* Colorway Filter */}
            <FilterAccordion
              title="Colorway"
              options={filterOptions.colorways}
              selected={selectedFilters.colorways}
              onToggle={(value) => updateFilters("colorways", value)}
              searchable
            />

            {/* Color Filter */}
            <FilterAccordion
              title="Color"
              options={filterOptions.colors}
              selected={selectedFilters.colors}
              onToggle={(value) => updateFilters("colors", value)}
              showColorDot
            />

            {/* Material Content Filter */}
            <FilterAccordion
              title="Material Content"
              options={filterOptions.materials}
              selected={selectedFilters.materials}
              onToggle={(value) => updateFilters("materials", value)}
            />

            {/* Description Categories Filter */}
            <FilterAccordion
              title="Description Categories"
              options={filterOptions.categories}
              selected={selectedFilters.categories}
              onToggle={(value) => updateFilters("categories", value)}
            />
          </Accordion>
        </div>
      </motion.aside>
    </>
  )
}

function FilterAccordion({
  title,
  options,
  selected,
  onToggle,
  searchable = false,
  showColorDot = false,
}: {
  title: string
  options: Array<{ name: string; slug?: string; hexValue?: string; count?: number }>
  selected: string[]
  onToggle: (value: string) => void
  searchable?: boolean
  showColorDot?: boolean
}) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredOptions = searchable
    ? options.filter((opt) => opt.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : options

  return (
    <AccordionItem value={title} className="border border-border rounded-sm">
      <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50 transition-colors">
        <span className="text-sm font-medium">{title}</span>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4">
        {searchable && (
          <div className="relative mb-3">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
            <input
              type="text"
              placeholder={`Search ${title.toLowerCase()}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-7 pr-2 py-1.5 text-xs bg-muted/50 border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        )}
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {filteredOptions.map((option) => {
            const value = option.slug || option.name
            const isSelected = selected.includes(value)

            return (
              <label key={value} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggle(value)}
                  className="rounded border-border text-primary focus:ring-primary"
                />
                {showColorDot && option.hexValue && (
                  <span
                    className="w-3 h-3 rounded-full border border-border flex-shrink-0"
                    style={{ backgroundColor: option.hexValue }}
                  />
                )}
                <span className="text-sm group-hover:text-foreground transition-colors flex-1">{option.name}</span>
                {option.count !== undefined && <span className="text-xs text-muted-foreground">({option.count})</span>}
              </label>
            )
          })}
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
