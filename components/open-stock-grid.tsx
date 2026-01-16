"use client"

import { useEffect, useState, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { client } from "@/sanity/lib/client"
import { OpenStockCard } from "./open-stock-card"
import type { OpenStockItem } from "@/sanity/types"

interface OpenStockGridProps {
  hasScrolled?: boolean
}

interface Color {
  _id: string
  name: string
  slug: { current: string }
}

interface Material {
  _id: string
  name: string
  slug: { current: string }
}

export function OpenStockGrid({ hasScrolled = true }: OpenStockGridProps) {
  const searchParams = useSearchParams()
  const [items, setItems] = useState<OpenStockItem[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<string>("fabric-asc")

  const colorParam = searchParams.get("color")
  const materialParam = searchParams.get("material")
  const searchQuery = searchParams.get("search")

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true)

      const query = `
        *[_type == "openStockItem" && defined(images[0].asset)] | order(fabric asc) {
          _id,
          itemNumber,
          fabric,
          colorway,
          price,
          content,
          width,
          description,
          "colors": colors[]->{name, slug, hexValue},
          "materials": materials[]->{name, slug},
          images[] {
            asset->,
            alt
          }
        }
      `

      const result = await client.fetch(query)
      setItems(result)
      setLoading(false)
    }

    fetchItems()
  }, [])

  const filteredAndSortedItems = useMemo(() => {
    let filtered = [...items]

    // Filter by color
    if (colorParam) {
      const colorSlugs = colorParam.split(",")
      filtered = filtered.filter((item) => item.colors?.some((color) => colorSlugs.includes(color.slug.current)))
    }

    // Filter by material
    if (materialParam) {
      const materialSlugs = materialParam.split(",")
      filtered = filtered.filter((item) =>
        item.materials?.some((material) => materialSlugs.includes(material.slug.current)),
      )
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          item.fabric.toLowerCase().includes(query) ||
          item.colorway.toLowerCase().includes(query) ||
          item.itemNumber.toLowerCase().includes(query) ||
          item.content?.toLowerCase().includes(query),
      )
    }

    // Sort
    switch (sortBy) {
      case "fabric-asc":
        filtered.sort((a, b) => a.fabric.localeCompare(b.fabric))
        break
      case "fabric-desc":
        filtered.sort((a, b) => b.fabric.localeCompare(a.fabric))
        break
      case "price-asc":
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0))
        break
      case "price-desc":
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0))
        break
      case "item-asc":
        filtered.sort((a, b) => a.itemNumber.localeCompare(b.itemNumber))
        break
      case "item-desc":
        filtered.sort((a, b) => b.itemNumber.localeCompare(a.itemNumber))
        break
    }

    return filtered
  }, [items, colorParam, materialParam, searchQuery, sortBy])

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-2 animate-pulse">
              <div className="aspect-square bg-muted rounded" />
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-8">
        <p className="text-sm text-muted-foreground">
          {filteredAndSortedItems.length} item{filteredAndSortedItems.length !== 1 ? "s" : ""}
        </p>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="text-sm bg-transparent border border-border rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="fabric-asc">Fabric: A-Z</option>
          <option value="fabric-desc">Fabric: Z-A</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="item-asc">Item #: Low to High</option>
          <option value="item-desc">Item #: High to Low</option>
        </select>
      </div>

      {filteredAndSortedItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No items found matching your criteria.</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {filteredAndSortedItems.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
            >
              <OpenStockCard item={item} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
