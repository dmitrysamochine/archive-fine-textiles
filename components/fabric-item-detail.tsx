"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { urlForImage } from "@/sanity/lib/image"
import type { FabricItem } from "@/sanity/types"
import { RelatedFabrics } from "./related-fabrics"

interface FabricItemDetailProps {
  item: FabricItem
}

export function FabricItemDetail({ item }: FabricItemDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const images = item.images || []
  const hasMultipleImages = images.length > 1

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const currentImageUrl = images[currentImageIndex]
    ? urlForImage(images[currentImageIndex]).width(2000).height(2000).url()
    : "/placeholder.svg?height=2000&width=2000"

  return (
    <>
      {/* Full viewport image with info overlay */}
      <div className="relative h-screen w-full overflow-hidden">
        {/* Background Image */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <Image
              src={currentImageUrl || "/placeholder.svg"}
              alt={item.itemNumber}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          </motion.div>
        </AnimatePresence>

        {/* Image Navigation Arrows */}
        {hasMultipleImages && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-6 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-6 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        {/* Info Overlay - Right Side */}
        <div className="absolute right-0 top-0 bottom-0 w-full md:w-96 bg-background/95 backdrop-blur-sm p-8 overflow-y-auto">
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-heading mb-2">{item.itemNumber}</h1>
              {item.collection && <p className="text-lg text-muted-foreground">{item.collection.name}</p>}
              {item.colorway && <p className="text-lg text-muted-foreground">{item.colorway.name}</p>}
            </div>

            {/* Price */}
            {item.price && (
              <div className="pt-4 border-t border-border">
                <p className="text-2xl font-heading">${item.price}</p>
              </div>
            )}

            {/* Specifications */}
            <div className="space-y-4 pt-4 border-t border-border">
              {item.width && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Width</h3>
                  <p className="text-sm">{item.width}</p>
                </div>
              )}

              {item.composition && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Composition</h3>
                  <p className="text-sm">{item.composition}</p>
                </div>
              )}

              {item.origin && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Origin</h3>
                  <p className="text-sm">{item.origin}</p>
                </div>
              )}

              {item.description && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
                  <p className="text-sm">{item.description}</p>
                </div>
              )}

              {item.categories && item.categories.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {item.categories.map((category) => (
                      <span key={category.slug.current} className="text-xs px-2 py-1 bg-muted rounded">
                        {category.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {item.colors && item.colors.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Colors</h3>
                  <div className="flex flex-wrap gap-2">
                    {item.colors.map((color) => (
                      <span key={color.slug.current} className="text-xs px-2 py-1 bg-muted rounded">
                        {color.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Image Counter */}
            {hasMultipleImages && (
              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Image {currentImageIndex + 1} of {images.length}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Items from Same Colorway */}
      {item.colorway && <RelatedFabrics colorwayId={item.colorway._id} currentItemId={item._id} />}
    </>
  )
}
