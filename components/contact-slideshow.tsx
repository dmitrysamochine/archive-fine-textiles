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
      <div className="w-full bg-muted rounded-sm flex items-center justify-center py-20">
        <p className="text-muted-foreground">No images</p>
      </div>
    )
  }

  return (
    <div className="relative w-full">
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="w-full"
          style={{ position: currentIndex === 0 ? "relative" : "absolute", top: 0, left: 0 }}
        >
          <Image
            src={images[currentIndex].asset.url || "/placeholder.svg"}
            alt={images[currentIndex].alt || "Contact image"}
            width={1200}
            height={800}
            className="w-full h-auto"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={currentIndex === 0}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
