"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from "lucide-react"
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"
import { urlForImage } from "@/sanity/lib/image"
import type { FabricItem } from "@/sanity/types"
import { RelatedFabrics } from "./related-fabrics"
import { LoadingSpinner } from "./loading-spinner"

interface FabricItemDetailProps {
  item: FabricItem
  onImageLoad?: () => void
}

export function FabricItemDetail({ item, onImageLoad }: FabricItemDetailProps) {
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
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: currentImageLoaded ? 1 : 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0"
            >
              <TransformWrapper
                initialScale={1}
                minScale={1}
                maxScale={4}
                centerOnInit
                wheel={{ step: 0.3 }}
                pinch={{ step: 10 }}
                doubleClick={{ mode: "reset" }}
                panning={{ velocityDisabled: true }}
                velocityAnimation={{ disabled: true, sensitivity: 0 }}
                options={{
                  zoomAnimation: { disabled: true }, // Disables zoom animation
                  panning: { animationTime: 0 }, // Disables panning animation
                }}
              >
                {({ zoomIn, zoomOut, resetTransform }) => (
                  <>
                    <TransformComponent wrapperClass="!w-full !h-full" contentClass="!w-full !h-full">
                      <Image
                        src={currentImageUrl || "/placeholder.svg"}
                        alt={item.itemNumber}
                        fill
                        className="object-cover"
                        priority
                        sizes="100vw"
                        onLoad={handleImageLoad}
                      />
                    </TransformComponent>

                    {currentImageLoaded && (
                      <div className="absolute bottom-6 right-6 md:right-[25rem] flex gap-2 z-20">
                        <button
                          onClick={() => zoomIn(0.5)}
                          className="bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
                          aria-label="Zoom in"
                        >
                          <ZoomIn className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => zoomOut(0.5)}
                          className="bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
                          aria-label="Zoom out"
                        >
                          <ZoomOut className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => resetTransform()}
                          className="bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
                          aria-label="Reset zoom"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </TransformWrapper>
            </motion.div>
          </AnimatePresence>
        </div>

        {!currentImageLoaded && (
          <div className="absolute inset-y-0 left-0 right-0 md:right-96 flex items-center justify-center pointer-events-none z-10">
            <LoadingSpinner />
          </div>
        )}

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
              className="absolute right-6 top-1/2 -translate-y-1/2 z-10 md:right-[25rem] bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-colors"
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
