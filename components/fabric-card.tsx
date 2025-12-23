import Link from "next/link"
import { SanityImage } from "@/lib/sanity-image"
import type { FabricItem } from "@/sanity/types"

interface FabricCardProps {
  item: FabricItem
}

export function FabricCard({ item }: FabricCardProps) {
  const firstImage = item.images?.[0]

  return (
    <Link href={`/fabrics/${item.itemNumber}`} className="block group">
      <article className="space-y-2">
        {firstImage && (
          <div className="aspect-square overflow-hidden bg-muted">
            <SanityImage
              image={firstImage.asset}
              alt={firstImage.alt || item.fabric.name}
              width={400}
              height={400}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
        <div className="space-y-1">
          {item.collection && <h3 className="font-heading font-medium">{item.collection.name}</h3>}
          {item.colorway && (
            <h4 className="text-sm font-sans font-medium text-muted-foreground">{item.colorway.name}</h4>
          )}
          <p className="text-sm">Item #{item.itemNumber}</p>
          {item.price && <p className="font-medium">${item.price}/yard</p>}
        </div>
      </article>
    </Link>
  )
}
