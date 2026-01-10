"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

interface ContactSlideshowProps {
  images: Array<{
    asset: {
      _id: string
      url: string
    }
    alt?: string
  }>
}

export function ContactSlideshow({ images }: ContactSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (images.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [images.length])

  if (!images || images.length === 0) {
    return (
      <div className="aspect-[3/4] bg-muted rounded-sm flex items-center justify-center">
        <p className="text-muted-foreground">No images</p>
      </div>
    )
  }

  return (
    <div className="relative aspect-[3/4] overflow-hidden rounded-sm">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={images[currentIndex].asset.url || "/placeholder.svg"}
            alt={images[currentIndex].alt || "Contact image"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={currentIndex === 0}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
