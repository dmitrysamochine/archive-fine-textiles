import { SanityImage } from "@/lib/sanity-image"
import type { OpenStockItem } from "@/sanity/types"

interface OpenStockCardProps {
  item: OpenStockItem
}

export function OpenStockCard({ item }: OpenStockCardProps) {
  const firstImage = item.images?.[0]

  return (
    <div className="block group">
      <article>
        {firstImage && (
          <div className="relative aspect-square overflow-hidden rounded-sm mb-3">
            <SanityImage
              image={firstImage.asset}
              alt={firstImage.alt || item.fabric}
              width={600}
              height={600}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
        <div className="space-y-1">
          <h3 className="text-sm font-heading font-medium">{item.fabric}</h3>
          <h4 className="text-xs font-sans">{item.colorway}</h4>
          <p className="text-xs font-medium">{item.itemNumber}</p>
        </div>
      </article>
    </div>
  )
}
