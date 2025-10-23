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
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    client
      .fetch<FabricItem[]>(
        `*[_type == "fabricItem" && defined(images[0])] | order(_createdAt desc) [0...24] {
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
        setTimeout(() => setIsLoaded(true), 100)
      })
  }, [])

  if (fabrics.length === 0) return null

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div className="grid grid-cols-24 h-full relative">
        {fabrics.map((fabric, index) => {
          const imageUrl = fabric.images?.[0]
            ? urlForImage(fabric.images[0]).width(400).height(400).url()
            : "/placeholder.svg?height=400&width=400"

          return (
            <motion.div
              key={fabric._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: isLoaded ? 1 : 0 }}
              transition={{ duration: 0.4, delay: index * 0.02 }}
            >
              <Link
                href={`/fabrics/${fabric.itemNumber}`}
                className="relative overflow-hidden group block h-full"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="absolute inset-0">
                  <Image
                    src={imageUrl || "/placeholder.svg"}
                    alt={fabric.itemNumber}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 25vw, 4.17vw"
                  />
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 bg-white/30 pointer-events-none"
                />
              </Link>
            </motion.div>
          )
        })}

        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ x: "-100%" }}
          animate={{ x: isLoaded ? "100%" : "-100%" }}
          transition={{ duration: 1.5, ease: "easeInOut", delay: 0.3 }}
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
            width: "100%",
          }}
        />
      </div>

      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div
          className="bg-cream-100"
          style={{
            paddingBlock: "calc(var(--spacing) * 14)",
            paddingInline: "calc(var(--spacing) * 14)",
            borderRadius: "20px",
          }}
        >
          <Image src="/logo.svg" alt="Archive Fine Textiles" width={800} height={200} className="w-[20vw] h-auto" />
        </div>
      </motion.div>
    </div>
  )
}
