"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Minimize2 } from "lucide-react"
import { TransformWrapper, TransformComponent, useControls } from "react-zoom-pan-pinch"
import Image from "next/image"
import { urlForImage } from "@/sanity/lib/image"
import type { FabricItem } from "@/sanity/types"
import { RelatedFabrics } from "./related-fabrics"
import { LoadingSpinner } from "./loading-spinner"

interface FabricItemDetailProps {
  item: FabricItem
  onImageLoad?: () => void
}

function ZoomControls() {
  const { zoomIn, zoomOut, resetTransform } = useControls()

  return (
    <div className="absolute bottom-6 left-6 z-10 flex gap-2 md:left-auto md:right-[25rem]">
      <button
        onClick={() => zoomIn()}
        className="bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
        aria-label="Zoom in"
      >
        <ZoomIn className="h-4 w-4" />
      </button>
      <button
        onClick={() => zoomOut()}
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
        <Minimize2 className="h-4 w-4" />
      </button>
    </div>
  )
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
      <div className="relative w-full flex flex-col-reverse md:h-screen md:flex-row md:overflow-hidden">
        {/* Info Panel - shows first on mobile, overlays on desktop */}
        <div className="w-full md:absolute md:right-0 md:top-0 md:bottom-0 md:w-96 bg-background/95 backdrop-blur-sm p-8 overflow-y-auto md:z-20">
          <div className="space-y-6">
            <div>
              {item.collection && <h1 className="text-3xl font-heading mb-2">{item.collection.name}</h1>}
              {item.colorway && <h2 className="text-xl font-sans mb-2 text-muted-foreground">{item.colorway.name}</h2>}
            </div>

            {/* Specifications */}
            <div className="space-y-4 pt-4 border-t border-border">
              {item.price && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-1">Price</h3>
                  <p className="text-sm text-muted-foreground">${item.price}</p>
                </div>
              )}

              {item.content && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-1">Material Content</h3>
                  <p className="text-sm text-muted-foreground">{item.content}</p>
                </div>
              )}

              {item.width && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-1">Width</h3>
                  <p className="text-sm text-muted-foreground">{item.width}</p>
                </div>
              )}

              {item.repeat && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-1">Pattern Repeat</h3>
                  <p className="text-sm text-muted-foreground">{item.repeat}</p>
                </div>
              )}

              {item.categories && item.categories.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2">Description Categories</h3>
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

        {/* Background Image - shows second on mobile (scroll down), fills screen on desktop */}
        <div className="relative w-full h-screen md:flex-1 bg-white flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: currentImageLoaded ? 1 : 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 w-full h-full"
            >
              <TransformWrapper
                initialScale={1}
                minScale={1}
                maxScale={4}
                wheel={{ step: 0.3 }}
                velocityAnimation={{ disabled: true }}
                doubleClick={{ mode: "toggle" }}
                panning={{ velocityDisabled: true }}
              >
                <TransformComponent
                  wrapperClass="!w-full !h-full"
                  contentClass="!w-full !h-full flex items-center justify-center"
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={currentImageUrl || "/placeholder.svg"}
                      alt={item.itemNumber}
                      fill
                      className="object-contain"
                      onLoad={handleImageLoad}
                      priority
                      sizes="(max-width: 768px) 100vw, calc(100vw - 24rem)"
                    />
                  </div>
                </TransformComponent>
                {currentImageLoaded && <ZoomControls />}
              </TransformWrapper>
            </motion.div>
          </AnimatePresence>
        </div>

        {!currentImageLoaded && (
          <div className="absolute inset-0 md:right-96 flex items-center justify-center bg-white z-10">
            <LoadingSpinner />
          </div>
        )}

        {/* Image Navigation Arrows */}
        {hasMultipleImages && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-6 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-colors md:left-6"
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
      </div>

      {/* Related Items from Same Colorway */}
      {item.colorway && <RelatedFabrics colorwayId={item.colorway._id} currentItemId={item._id} />}
    </>
  )
}
