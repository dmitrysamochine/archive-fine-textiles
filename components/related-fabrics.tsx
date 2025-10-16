"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { client } from "@/sanity/lib/client"
import { urlForImage } from "@/sanity/lib/image"

interface FabricItem {
  _id: string
  itemNumber: string
  collection?: { name: string }
  colorway?: { name: string }
  images?: Array<{ asset: { _ref: string } }>
}

interface RelatedFabricsProps {
  colorwayId: string
  currentItemId: string
}

export function RelatedFabrics({ colorwayId, currentItemId }: RelatedFabricsProps) {
  const [fabrics, setFabrics] = useState<FabricItem[]>([])
  const [colorwayName, setColorwayName] = useState("")

  useEffect(() => {
    client
      .fetch<{ items: FabricItem[]; colorway: { name: string } }>(
        `{
          "items": *[_type == "fabricItem" && colorway._ref == $colorwayId && _id != $currentItemId && defined(images[0])] [0...12] {
            _id,
            itemNumber,
            "collection": fabric->{name},
            colorway->{name},
            images
          },
          "colorway": *[_type == "colorway" && _id == $colorwayId][0]{name}
        }`,
        { colorwayId, currentItemId },
      )
      .then((data) => {
        setFabrics(data.items)
        setColorwayName(data.colorway?.name || "")
      })
  }, [colorwayId, currentItemId])

  if (fabrics.length === 0) return null

  return (
    <div className="container mx-auto px-6 py-16">
      <h2 className="text-2xl font-heading mb-8">More from {colorwayName}</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {fabrics.map((fabric, index) => {
          const imageUrl = fabric.images?.[0]
            ? urlForImage(fabric.images[0]).width(600).height(600).url()
            : "/placeholder.svg?height=600&width=600"

          return (
            <motion.div
              key={fabric._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={`/fabrics/${fabric.itemNumber}`} className="group block">
                <div className="relative aspect-square overflow-hidden rounded-sm mb-3">
                  <Image
                    src={imageUrl || "/placeholder.svg"}
                    alt={fabric.itemNumber}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                </div>
                <div className="space-y-1">
                  {fabric.collection && <h3 className="text-sm font-heading">{fabric.collection.name}</h3>}
                  {fabric.colorway && <h4 className="text-xs font-medium">{fabric.colorway.name}</h4>}
                  <p className="text-xs text-muted-foreground">{fabric.itemNumber}</p>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
