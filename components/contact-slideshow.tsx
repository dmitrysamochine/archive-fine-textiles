"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"

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
    <div className="relative w-full overflow-hidden">
      {images.map((image, index) => (
        <motion.div
          key={image.asset._id}
          initial={false}
          animate={{
            opacity: index === currentIndex ? 1 : 0,
            zIndex: index === currentIndex ? 1 : 0,
          }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className={`w-full ${index === 0 ? "relative" : "absolute top-0 left-0"}`}
        >
          <Image
            src={image.asset.url || "/placeholder.svg"}
            alt={image.alt || "Contact image"}
            width={1200}
            height={800}
            className="w-full h-auto"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={index === 0}
          />
        </motion.div>
      ))}
    </div>
  )
}
