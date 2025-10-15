"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { client } from "@/sanity/lib/client"
import { urlForImage } from "@/sanity/lib/image"

interface FabricItem {
  _id: string
  itemNumber: string
  collection?: { name: string }
  colorway?: { name: string }
  images?: Array<{ asset: { _ref: string } }>
}

export function HeroGrid() {
  const [fabrics, setFabrics] = useState<FabricItem[]>([])
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  useEffect(() => {
    // Fetch random 32 fabrics for hero grid
    client
      .fetch<FabricItem[]>(
        `*[_type == "fabricItem" && defined(images[0])] | order(_createdAt desc) [0...32] {
          _id,
          itemNumber,
          collection->{name},
          colorway->{name},
          images
        }`,
      )
      .then((data) => {
        // Shuffle for random display
        const shuffled = data.sort(() => Math.random() - 0.5)
        setFabrics(shuffled)
      })
  }, [])

  if (fabrics.length === 0) return null

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Grid: 2 rows × 16 columns */}
      <div className="grid grid-rows-2 h-full">
        {[0, 1].map((row) => (
          <div key={row} className="grid grid-cols-16 h-full">
            {fabrics.slice(row * 16, (row + 1) * 16).map((fabric, colIndex) => {
              const index = row * 16 + colIndex
              const imageUrl = fabric.images?.[0]
                ? urlForImage(fabric.images[0]).width(400).height(400).url()
                : "/placeholder.svg?height=400&width=400"

              return (
                <Link
                  key={fabric._id}
                  href={`/fabrics/${fabric.itemNumber}`}
                  className="relative overflow-hidden group"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <motion.div
                    className="absolute inset-0"
                    animate={{
                      scale: hoveredIndex === index ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <Image
                      src={imageUrl || "/placeholder.svg"}
                      alt={fabric.itemNumber}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 25vw, 6.25vw"
                    />
                  </motion.div>

                  {/* Hover overlay with info */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white p-2 text-center"
                  >
                    <p className="text-xs font-heading mb-1">{fabric.itemNumber}</p>
                    {fabric.collection && <p className="text-[10px]">{fabric.collection.name}</p>}
                    {fabric.colorway && <p className="text-[10px]">{fabric.colorway.name}</p>}
                  </motion.div>
                </Link>
              )
            })}
          </div>
        ))}
      </div>

      {/* Centered Logo with background rectangle */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="bg-cream-100 px-12 py-8 rounded-sm">
          <Image src="/logo.svg" alt="Archive Fine Textiles" width={400} height={100} className="w-1/3 max-w-md" />
        </div>
      </div>
    </div>
  )
}
