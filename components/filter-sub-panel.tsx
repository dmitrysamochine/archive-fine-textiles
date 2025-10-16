"use client"

import { X, Search } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { client } from "@/sanity/lib/client"

interface FilterSubPanelProps {
  category: string | null
  isOpen: boolean
  onClose: () => void
}

interface FilterOption {
  name: string
  slug?: string
  hexValue?: string
  count: number
}

export function FilterSubPanel({ category, isOpen, onClose }: FilterSubPanelProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const panelRef = useRef<HTMLDivElement>(null)
  const [options, setOptions] = useState<FilterOption[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)

  const categoryLabels: Record<string, string> = {
    collection: "Collection",
    colorway: "Colorway",
    color: "Color",
    material: "Material Content",
    category: "Description Categories",
  }

  useEffect(() => {
    setSearchQuery("")
  }, [category])

  useEffect(() => {
    if (category && isOpen) {
      fetchOptions()
    }
  }, [category, isOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  const fetchOptions = async () => {
    if (!category) return

    setLoading(true)

    try {
      let data: FilterOption[] = []

      switch (category) {
        case "collection":
          data = await client.fetch(`*[_type == "fabricCollection"] | order(name asc) {
            name,
            "slug": slug.current,
            "count": count(*[_type == "fabricItem" && references(^._id)])
          }`)
          break
        case "colorway":
          data = await client.fetch(`*[_type == "colorway"] | order(name asc) {
            name,
            "slug": slug.current,
            "count": count(*[_type == "fabricItem" && references(^._id)])
          }`)
          break
        case "color":
          data = await client.fetch(`*[_type == "color"] | order(name asc) {
            name,
            "slug": slug.current,
            hexValue,
            "count": count(*[_type == "fabricItem" && references(^._id)])
          }`)
          break
        case "material":
          const materials = await client.fetch(`array::unique(*[_type == "fabricItem" && defined(content)].content)`)
          data = materials.map((m: string) => ({ name: m, count: 0 }))
          break
        case "category":
          data = await client.fetch(`*[_type == "category"] | order(name asc) {
            name,
            "slug": slug.current,
            "count": count(*[_type == "fabricItem" && references(^._id)])
          }`)
          break
      }

      setOptions(data)
    } catch (error) {
      console.error("[v0] Error fetching filter options:", error)
    } finally {
      setLoading(false)
    }
  }

  const selectedValues = searchParams.get(category || "")?.split(",") || []

  const toggleOption = (value: string) => {
    if (!category) return

    const params = new URLSearchParams(searchParams.toString())
    const current = params.get(category)?.split(",") || []
    const updated = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]

    if (updated.length > 0) {
      params.set(category, updated.join(","))
    } else {
      params.delete(category)
    }

    router.push(`/?${params.toString()}`, { scroll: false })
  }

  const filteredOptions = options.filter((opt) => opt.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const searchable = category === "collection" || category === "colorway"

  if (!isOpen) return null

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

      <motion.div
        ref={panelRef}
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed left-0 lg:left-20 top-[73px] bottom-0 w-full lg:w-80 bg-background border-r border-border z-50 flex flex-col"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={category}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex flex-col h-full"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-sm font-heading">{category ? categoryLabels[category] : ""}</h3>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            {searchable && (
              <div className="p-4 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder={`Search ${category ? categoryLabels[category].toLowerCase() : ""}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-muted/50 border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <p className="text-sm text-muted-foreground">Loading...</p>
              ) : filteredOptions.length === 0 ? (
                <p className="text-sm text-muted-foreground">No options found</p>
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
                        <span className="text-sm group-hover:text-foreground transition-colors flex-1">
                          {option.name}
                        </span>
                        {option.count > 0 && <span className="text-xs text-muted-foreground">({option.count})</span>}
                      </label>
                    )
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </>
  )
}
