"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { X } from "lucide-react"
import { client } from "@/sanity/lib/client"
import { FabricItemDetail } from "./fabric-item-detail"
import type { FabricItem } from "@/sanity/types"

interface FabricDetailModalProps {
  itemNumber: string
  onClose: () => void
}

export function FabricDetailModal({ itemNumber, onClose }: FabricDetailModalProps) {
  const [fabric, setFabric] = useState<FabricItem | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFabric = async () => {
      setLoading(true)
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

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-background z-50 flex items-center justify-center"
      >
        <p className="text-muted-foreground">Loading...</p>
      </motion.div>
    )
  }

  if (!fabric) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-background z-50 flex items-center justify-center"
      >
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Fabric not found</p>
          <button onClick={onClose} className="text-sm underline">
            Close
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="relative h-full w-full overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="fixed top-6 left-6 z-[60] bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-colors"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>

        <FabricItemDetail item={fabric} />
      </motion.div>
    </motion.div>
  )
}
