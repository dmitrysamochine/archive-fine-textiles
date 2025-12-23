"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { client } from "@/sanity/lib/client"
import { urlForImage } from "@/sanity/lib/image"
import { LoadingSpinner } from "./loading-spinner"

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
  const [imagesLoaded, setImagesLoaded] = useState(false)
  const [loadedCount, setLoadedCount] = useState(0)

  console.log("[v0] HeroGrid render:", {
    fabricsCount: fabrics.length,
    loadedCount,
    imagesLoaded,
    isLoaded,
  })

  useEffect(() => {
    console.log("[v0] HeroGrid: Fetching fabrics...")
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
        console.log("[v0] HeroGrid: Fabrics fetched:", data.length)
        const shuffled = data.sort(() => Math.random() - 0.5)
        setFabrics(shuffled)
      })
      .catch((error) => {
        console.error("[v0] HeroGrid: Error fetching fabrics:", error)
      })
  }, [])

  useEffect(() => {
    console.log("[v0] HeroGrid: Checking if all images loaded:", {
      fabricsLength: fabrics.length,
      loadedCount,
    })
    if (fabrics.length > 0 && loadedCount >= fabrics.length) {
      console.log("[v0] HeroGrid: All images loaded!")
      setImagesLoaded(true)
      setTimeout(() => setIsLoaded(true), 100)
    }
  }, [loadedCount, fabrics.length])

  const handleImageLoad = () => {
    setLoadedCount((prev) => {
      const newCount = prev + 1
      console.log("[v0] HeroGrid: Image loaded:", newCount)
      return newCount
    })
  }

  if (fabrics.length === 0) {
    console.log("[v0] HeroGrid: Showing loading spinner (no fabrics yet)")
    return (
      <div className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-background">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {!imagesLoaded && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background">
          <LoadingSpinner />
        </div>
      )}

      <div className="grid grid-cols-24 h-full relative">
        {fabrics.map((fabric, index) => {
          const imageUrl = fabric.images?.[0]
            ? urlForImage(fabric.images[0]).width(600).height(600).url()
            : "/placeholder.svg?height=600&width=600"

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
                    onLoad={handleImageLoad}
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
        transition={{ duration: 0.8, delay: 1.05 }}
      >
        <Image
          src="/logo.svg"
          alt="Archive Fine Textiles"
          width={800}
          height={200}
          className="w-[85vw] md:w-[20vw] h-auto px-4 md:px-0"
          style={{
            filter: "drop-shadow(0 0 8px rgba(255, 255, 255, 0.6)) drop-shadow(0 0 16px rgba(255, 255, 255, 0.4))",
          }}
        />
      </motion.div>
    </div>
  )
}
