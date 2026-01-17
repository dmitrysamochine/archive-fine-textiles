"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Minimize2 } from "lucide-react"
import { TransformWrapper, TransformComponent, useControls } from "react-zoom-pan-pinch"
import Image from "next/image"
import { urlForImage } from "@/sanity/lib/image"
import type { OpenStockItem } from "@/sanity/types"
import { LoadingSpinner } from "./loading-spinner"

interface OpenStockItemDetailProps {
  item: OpenStockItem
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

export function OpenStockItemDetail({ item, onImageLoad }: OpenStockItemDetailProps) {
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
      <div className="relative w-full md:h-screen md:overflow-hidden">
        <div className="flex flex-col md:flex-row md:h-full">
          {/* Info Panel - first on mobile (top), overlay on desktop (right side) */}
          <div className="w-full md:absolute md:right-0 md:top-0 md:bottom-0 md:w-96 bg-background md:bg-background/95 md:backdrop-blur-sm p-8 overflow-y-auto md:z-20 md:shadow-xl">
            <div className="space-y-6">
              <div>
                {item.fabric && <h1 className="text-3xl font-heading mb-2">{item.fabric}</h1>}
                {item.colorway && <h2 className="text-xl font-sans mb-2 text-muted-foreground">{item.colorway}</h2>}
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
                    <h3 className="text-sm font-semibold text-muted-foreground mb-1">Material</h3>
                    <p className="text-sm text-muted-foreground">{item.content}</p>
                  </div>
                )}

                {item.width && (
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-1">Width</h3>
                    <p className="text-sm text-muted-foreground">{item.width}</p>
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

          <div className="relative w-full h-[70vh] md:h-full md:w-[calc(100%-24rem)] bg-white flex items-center justify-center">
            {!currentImageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                <LoadingSpinner />
              </div>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: currentImageLoaded ? 1 : 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full"
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
                  <TransformComponent wrapperClass="!w-full !h-full" contentClass="!w-full !h-full">
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

          {/* Image Navigation Arrows */}
          {hasMultipleImages && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-6 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-colors md:top-1/2"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-6 top-1/2 -translate-y-1/2 z-10 md:right-[25rem] bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-colors md:top-1/2"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
        </div>
      </div>
    </>
  )
}
