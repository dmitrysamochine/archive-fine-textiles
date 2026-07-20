"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, ArrowLeft, Mail, Phone } from "lucide-react"
import { FurnitureImage } from "@/components/furniture-image"
import { formatPrice, buildInquiryMailto, buildTelLink } from "@/lib/shop"
import type { FurnitureItem, ShopSettings } from "@/sanity/types"

interface FurnitureItemDetailProps {
  item: FurnitureItem
  settings?: ShopSettings | null
}

export function FurnitureItemDetail({ item, settings }: FurnitureItemDetailProps) {
  const images = item.images || []
  const hasMultipleImages = images.length > 1
  const [currentIndex, setCurrentIndex] = useState(0)

  const isSold = item.available === false
  const mailto = buildInquiryMailto(settings?.purchaseEmail, item.title)
  const tel = buildTelLink(settings?.purchasePhone)

  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % images.length)
  const prevImage = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)

  return (
    <div className="container mx-auto px-4 md:px-6 pt-28 pb-20">
      <Link
        href="/shop/furniture"
        className="inline-flex items-center gap-2 text-sm font-sans uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Furniture
      </Link>

      <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
        {/* Image gallery */}
        <div className="w-full lg:w-3/5">
          <div className="relative bg-muted overflow-hidden">
            <FurnitureImage
              image={images[currentIndex]}
              alt={images[currentIndex]?.alt || `${item.title} by ${item.maker}`}
              width={1600}
              height={1200}
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="w-full h-auto object-contain aspect-[4/3]"
            />

            {isSold && (
              <span className="absolute top-4 left-4 bg-foreground text-background text-xs font-sans uppercase tracking-widest px-3 py-1.5">
                Sold
              </span>
            )}

            {hasMultipleImages && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background p-3 rounded-full shadow-lg transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background p-3 rounded-full shadow-lg transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {hasMultipleImages && (
            <div className="mt-4 flex flex-wrap gap-3">
              {images.map((img, i) => (
                <button
                  key={img.asset?._id || i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-20 h-20 overflow-hidden bg-muted transition-opacity ${
                    i === currentIndex ? "ring-2 ring-foreground" : "opacity-60 hover:opacity-100"
                  }`}
                  aria-label={`View image ${i + 1}`}
                >
                  <FurnitureImage
                    image={img}
                    alt={img.alt || `${item.title} thumbnail ${i + 1}`}
                    width={160}
                    height={160}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="w-full lg:w-2/5">
          <div className="lg:sticky lg:top-28 space-y-8">
            <div className="space-y-2">
              {item.era && (
                <p className="text-xs font-sans uppercase tracking-[0.2em] text-muted-foreground">{item.era}</p>
              )}
              <h1 className="text-4xl font-heading leading-tight text-balance">{item.title}</h1>
              <p className="text-lg font-sans text-muted-foreground">{item.maker}</p>
            </div>

            <p className="text-2xl font-heading">{formatPrice(item.price)}</p>

            {item.description && (
              <p className="text-sm font-sans leading-relaxed text-muted-foreground text-pretty">{item.description}</p>
            )}

            <dl className="space-y-4 text-sm font-sans border-t border-border pt-6">
              {item.materialContent && (
                <div className="flex flex-col gap-1">
                  <dt className="text-muted-foreground uppercase tracking-wider text-xs">Materials</dt>
                  <dd>{item.materialContent}</dd>
                </div>
              )}
              {item.dimensions && (
                <div className="flex flex-col gap-1">
                  <dt className="text-muted-foreground uppercase tracking-wider text-xs">Dimensions</dt>
                  <dd>{item.dimensions}</dd>
                </div>
              )}
            </dl>

            {/* Contact to purchase */}
            <div className="border-t border-border pt-8 space-y-4">
              {isSold ? (
                <div className="space-y-3">
                  <p className="text-sm font-sans text-muted-foreground text-pretty">
                    This piece has been sold. Contact us to enquire about similar pieces from our collection.
                  </p>
                </div>
              ) : (
                <p className="text-sm font-sans text-muted-foreground text-pretty">
                  This is a one-of-a-kind piece available by direct enquiry. Contact us to purchase or arrange a viewing.
                </p>
              )}

              <div className="flex flex-col gap-3">
                {mailto && (
                  <a
                    href={mailto}
                    className="inline-flex items-center justify-center gap-2 bg-foreground text-background px-6 py-3 text-sm font-sans uppercase tracking-widest hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <Mail className="h-4 w-4" />
                    Email to Purchase
                  </a>
                )}
                {tel && (
                  <a
                    href={tel}
                    className="inline-flex items-center justify-center gap-2 border border-foreground px-6 py-3 text-sm font-sans uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors"
                  >
                    <Phone className="h-4 w-4" />
                    {settings?.purchasePhone}
                  </a>
                )}
                {!mailto && !tel && (
                  <Link
                    href="/contact-us"
                    className="inline-flex items-center justify-center gap-2 bg-foreground text-background px-6 py-3 text-sm font-sans uppercase tracking-widest hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    Contact Us
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
