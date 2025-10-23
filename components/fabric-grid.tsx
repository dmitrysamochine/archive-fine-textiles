"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { ArrowUpDown } from "lucide-react"
import { client } from "@/sanity/lib/client"
import { urlForImage } from "@/sanity/lib/image"

interface FabricItem {
  _id: string
  itemNumber: string
  collection?: { name: string; slug: string }
  colorway?: { name: string; slug: string }
  images?: Array<{ asset: { _ref: string } }>
  price?: number
  content?: string
  categories?: Array<{ name: string; slug: string }>
  colors?: Array<{ name: string; slug: string }>
}

interface FabricGridProps {
  hasScrolled: boolean
  onFabricClick: (itemNumber: string) => void
}

export function FabricGrid({ hasScrolled, onFabricClick }: FabricGridProps) {
  const [fabrics, setFabrics] = useState<FabricItem[]>([])
  const [allFabrics, setAllFabrics] = useState<FabricItem[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [sortBy, setSortBy] = useState("item-asc")
  const searchParams = useSearchParams()

  useEffect(() => {
    loadAllFabrics()
  }, [])

  useEffect(() => {
    filterAndSortFabrics()
  }, [searchParams, allFabrics, sortBy])

  const loadAllFabrics = async () => {
    const query = `*[_type == "fabricItem" && defined(images[0])] {
      _id,
      itemNumber,
      "collection": fabric->{name, "slug": slug.current},
      colorway->{name, "slug": slug.current},
      images,
      price,
      content,
      "categories": description[]->{name, "slug": slug.current},
      "colors": color[]->{name, "slug": slug.current}
    }`

    const data = await client.fetch<FabricItem[]>(query)
    setAllFabrics(data)
  }

  const filterAndSortFabrics = () => {
    let filtered = [...allFabrics]

    const collectionFilter = searchParams.get("collection")?.split(",")
    const colorwayFilter = searchParams.get("colorway")?.split(",")
    const colorFilter = searchParams.get("color")?.split(",")
    const materialFilter = searchParams.get("material")?.split(",")
    const categoryFilter = searchParams.get("category")?.split(",")
    const searchQuery = searchParams.get("search")?.toLowerCase()

    if (collectionFilter) {
      filtered = filtered.filter((f) => f.collection && collectionFilter.includes(f.collection.slug))
    }

    if (colorwayFilter) {
      filtered = filtered.filter((f) => f.colorway && colorwayFilter.includes(f.colorway.slug))
    }

    if (colorFilter) {
      filtered = filtered.filter((f) => f.colors && f.colors.some((c: any) => colorFilter.includes(c.slug)))
    }

    if (materialFilter) {
      filtered = filtered.filter((f) => f.content && materialFilter.some((m) => f.content?.includes(m)))
    }

    if (categoryFilter) {
      filtered = filtered.filter((f) => f.categories && f.categories.some((c: any) => categoryFilter.includes(c.slug)))
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (f) =>
          f.itemNumber.toLowerCase().includes(searchQuery) ||
          f.collection?.name.toLowerCase().includes(searchQuery) ||
          f.colorway?.name.toLowerCase().includes(searchQuery) ||
          f.categories?.some((c: any) => c.name.toLowerCase().includes(searchQuery)),
      )
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-high":
          return (b.price || 0) - (a.price || 0)
        case "price-low":
          return (a.price || 0) - (b.price || 0)
        case "item-desc":
          return b.itemNumber.localeCompare(a.itemNumber)
        case "item-asc":
        default:
          return a.itemNumber.localeCompare(b.itemNumber)
      }
    })

    setFabrics(filtered)
    setHasMore(false)
  }

  const displayedFabrics = fabrics.slice(0, page * 30)

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
        displayedFabrics.length < fabrics.length
      ) {
        setPage((p) => p + 1)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [displayedFabrics.length, fabrics.length])

  console.log("[v0] FabricGrid render:", {
    allFabricsCount: allFabrics.length,
    fabricsCount: fabrics.length,
    displayedCount: displayedFabrics.length,
    hasScrolled,
  })

  return (
    <div className="container mx-auto px-6 py-12">
      {hasScrolled && (
        <div className="flex items-center justify-between mb-8">
          <p className="text-sm text-muted-foreground">
            Showing {displayedFabrics.length} of {fabrics.length} items
          </p>
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm bg-transparent border-none focus:outline-none cursor-pointer"
            >
              <option value="item-asc">Item Number: A-Z</option>
              <option value="item-desc">Item Number: Z-A</option>
              <option value="price-high">Price: High to Low</option>
              <option value="price-low">Price: Low to High</option>
            </select>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayedFabrics.map((fabric, index) => {
          const imageUrl = fabric.images?.[0]
            ? urlForImage(fabric.images[0]).width(600).height(600).url()
            : "/placeholder.svg?height=600&width=600"

          return (
            <motion.div
              key={fabric._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.03, ease: "easeOut" }}
            >
              <button onClick={() => onFabricClick(fabric.itemNumber)} className="group block w-full text-left">
                <div className="relative aspect-square overflow-hidden rounded-sm mb-3">
                  <Image
                    src={imageUrl || "/placeholder.svg"}
                    alt={fabric.itemNumber}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                </div>
                <div className="space-y-1">
                  {fabric.collection && <h3 className="text-sm font-heading">{fabric.collection.name}</h3>}
                  {fabric.colorway && <h4 className="text-xs font-medium">{fabric.colorway.name}</h4>}
                  <p className="text-xs text-muted-foreground">{fabric.itemNumber}</p>
                </div>
              </button>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
