"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { urlForImage } from "@/sanity/lib/image"
import type { FabricItem } from "@/sanity/types"
import { RelatedFabrics } from "./related-fabrics"
import { LoadingSpinner } from "./loading-spinner"

interface FabricItemDetailProps {
  item: FabricItem
  onImageLoad?: () => void
  imageLoaded?: boolean
}

export function FabricItemDetail({ item, onImageLoad, imageLoaded = false }: FabricItemDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [currentImageLoaded, setCurrentImageLoaded] = useState(false)
  const images = item.images || []
  const hasMultipleImages = images.length > 1

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
    setCurrentImageLoaded(false)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
    setCurrentImageLoaded(false)
  }

  const handleImageLoad = () => {
    setCurrentImageLoaded(true)
    onImageLoad?.()
  }

  const currentImageUrl = images[currentImageIndex]
    ? urlForImage(images[currentImageIndex]).width(2000).height(2000).url()
    : "/placeholder.svg?height=2000&width=2000"

  return (
    <>
      {/* Full viewport image with info overlay */}
      <div className="relative h-screen w-full overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 bg-white">
          {!currentImageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="-mr-48">
                <LoadingSpinner />
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: currentImageLoaded ? 1 : 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0"
            >
              <Image
                src={currentImageUrl || "/placeholder.svg"}
                alt={item.itemNumber}
                fill
                className="object-cover"
                priority
                sizes="100vw"
                onLoad={handleImageLoad}
              />
            </motion.div>
          </AnimatePresence>
        </div>

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

        <div className="absolute right-0 top-0 bottom-0 w-full md:w-96 bg-background/95 backdrop-blur-sm p-8 overflow-y-auto">
          <div className="space-y-6">
            <div>
              {item.collection && <h1 className="text-3xl font-heading mb-2">{item.collection.name}</h1>}
              {item.colorway && <h2 className="text-xl font-heading mb-2">{item.colorway.name}</h2>}
              <p className="text-lg text-muted-foreground">Item #{item.itemNumber}</p>
            </div>

            {/* Specifications */}
            <div className="space-y-4 pt-4 border-t border-border">
              {item.type && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Type</h3>
                  <p className="text-sm capitalize">{item.type}</p>
                </div>
              )}

              {/* Price */}
              {item.price && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Price</h3>
                  <p className="text-sm">${item.price}</p>
                </div>
              )}

              {item.content && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Material Content</h3>
                  <p className="text-sm">{item.content}</p>
                </div>
              )}

              {item.width && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Width</h3>
                  <p className="text-sm">{item.width}</p>
                </div>
              )}

              {item.repeat && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Pattern Repeat</h3>
                  <p className="text-sm">{item.repeat}</p>
                </div>
              )}

              {item.categories && item.categories.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Description Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {item.categories.map((category, index) => (
                      <span
                        key={category.slug?.current || `category-${index}`}
                        className="text-xs px-2 py-1 bg-muted rounded"
                      >
                        {category.name}
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
