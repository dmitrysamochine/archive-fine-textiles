"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { ChevronDown } from "lucide-react"
import { client } from "@/sanity/lib/client"
import { urlForImage } from "@/sanity/lib/image"
import { siteSettingsQuery } from "@/sanity/lib/queries"
import type { SiteSettings } from "@/sanity/types"

const DEFAULT_HERO = "/hero-background.jpg"

export function HeroGrid() {
  const [isLoaded, setIsLoaded] = useState(false)
  // Start with no src so we never load the fallback before knowing whether a
  // custom hero image exists. Exactly one image loads once the fetch resolves.
  const [heroSrc, setHeroSrc] = useState<string | null>(null)
  const [heroAlt, setHeroAlt] = useState("Soft draped fabric")

  useEffect(() => {
    let cancelled = false

    client
      .fetch<SiteSettings | null>(siteSettingsQuery)
      .then((settings) => {
        if (cancelled) return
        if (settings?.heroImage?.asset) {
          setHeroSrc(urlForImage(settings.heroImage).width(2400).height(1600).url())
          if (settings.heroImage.alt) setHeroAlt(settings.heroImage.alt)
        } else {
          setHeroSrc(DEFAULT_HERO)
        }
      })
      .catch(() => {
        // Fall back to the bundled default hero image on any fetch error.
        if (!cancelled) setHeroSrc(DEFAULT_HERO)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="relative h-screen w-full overflow-hidden bg-background">
      {/* Background image */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        {heroSrc && (
          <Image
            src={heroSrc || "/placeholder.svg"}
            alt={heroAlt}
            fill
            className="object-cover"
            priority
            onLoad={() => setIsLoaded(true)}
          />
        )}
      </motion.div>

      {/* Logo overlay */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
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

      {/* Scroll down indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <ChevronDown className="w-8 h-8 text-rich-black/50" strokeWidth={1.5} />
        </motion.div>
      </motion.div>
    </div>
  )
}
