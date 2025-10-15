"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { client } from "@/sanity/lib/client"
import { urlForImage } from "@/sanity/lib/image"

interface FabricItem {
  _id: string
  itemNumber: string
  collection?: { name: string }
  colorway?: { name: string }
  images?: Array<{ asset: { _ref: string } }>
}

export function FabricGrid() {
  const [fabrics, setFabrics] = useState<FabricItem[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const searchParams = useSearchParams()

  useEffect(() => {
    loadFabrics()
  }, [searchParams, page])

  const loadFabrics = async () => {
    const start = (page - 1) * 30
    const end = start + 30

    // Build query based on filters
    let query = `*[_type == "fabricItem" && defined(images[0])]`

    // Add filter conditions from URL params
    // TODO: Implement dynamic filtering based on searchParams

    query += ` | order(_createdAt desc) [${start}...${end}] {
      _id,
      itemNumber,
      collection->{name},
      colorway->{name},
      images
    }`

    const data = await client.fetch<FabricItem[]>(query)

    if (page === 1) {
      setFabrics(data)
    } else {
      setFabrics((prev) => [...prev, ...data])
    }

    setHasMore(data.length === 30)
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && hasMore) {
        setPage((p) => p + 1)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [hasMore])

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {fabrics.map((fabric, index) => {
          const imageUrl = fabric.images?.[0]
            ? urlForImage(fabric.images[0]).width(600).height(600).url()
            : "/placeholder.svg?height=600&width=600"

          return (
            <motion.div
              key={fabric._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={`/fabrics/${fabric.itemNumber}`} className="group block">
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
                  <p className="text-sm font-heading">{fabric.itemNumber}</p>
                  {fabric.collection && <p className="text-xs text-muted-foreground">{fabric.collection.name}</p>}
                  {fabric.colorway && <p className="text-xs text-muted-foreground">{fabric.colorway.name}</p>}
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
