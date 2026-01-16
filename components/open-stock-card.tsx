import { SanityImage } from "@/lib/sanity-image"
import type { OpenStockItem } from "@/sanity/types"

interface OpenStockCardProps {
  item: OpenStockItem
}

export function OpenStockCard({ item }: OpenStockCardProps) {
  const firstImage = item.images?.[0]

  return (
    <div className="block group">
      <article className="space-y-2">
        {firstImage && (
          <div className="aspect-square overflow-hidden bg-muted">
            <SanityImage
              image={firstImage.asset}
              alt={firstImage.alt || item.fabric}
              width={400}
              height={400}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
        <div className="space-y-1">
          <h3 className="font-heading font-medium">{item.fabric}</h3>
          <h4 className="text-sm font-sans font-medium text-muted-foreground">{item.colorway}</h4>
          <p className="text-sm">Item #{item.itemNumber}</p>
        </div>
      </article>
    </div>
  )
}
