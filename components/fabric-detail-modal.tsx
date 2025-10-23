"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { X } from "lucide-react"
import { client } from "@/sanity/lib/client"
import { FabricItemDetail } from "./fabric-item-detail"
import { LoadingSpinner } from "./loading-spinner"
import type { FabricItem } from "@/sanity/types"

interface FabricDetailModalProps {
  itemNumber: string
  onClose: () => void
}

export function FabricDetailModal({ itemNumber, onClose }: FabricDetailModalProps) {
  const [fabric, setFabric] = useState<FabricItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    const fetchFabric = async () => {
      setLoading(true)
      setImageLoaded(false)
      const query = `*[_type == "fabricItem" && itemNumber == $itemNumber][0] {
        _id,
        itemNumber,
        type,
        price,
        content,
        width,
        repeat,
        "collection": fabric->{_id, name, "slug": slug.current},
        colorway->{_id, name, "slug": slug.current},
        images,
        "categories": description[]->{name, "slug": slug.current},
        "colors": color[]->{name, "slug": slug.current}
      }`

      const data = await client.fetch<FabricItem>(query, { itemNumber })
      setFabric(data)
      setLoading(false)
    }

    fetchFabric()
  }, [itemNumber])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [])

  if (loading || !fabric) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="fixed inset-0 z-50"
      >
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm" onClick={onClose} />
        <div className="relative h-full w-full flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-50"
    >
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative h-full w-full overflow-y-auto">
        <button
          onClick={onClose}
          className="fixed top-6 right-6 z-[60] bg-black/80 hover:bg-black text-white p-3 rounded-full shadow-lg transition-colors"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>

        <FabricItemDetail item={fabric} onImageLoad={() => setImageLoaded(true)} imageLoaded={imageLoaded} />

        <div className="sticky bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent md:hidden">
          <button
            onClick={onClose}
            className="w-full bg-black hover:bg-black/90 text-white py-4 px-6 rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </motion.div>
  )
}
