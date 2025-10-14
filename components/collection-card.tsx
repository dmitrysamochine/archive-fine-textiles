import Link from "next/link"
import { SanityImage } from "@/lib/sanity-image"
import type { FabricCollection } from "@/sanity/types"

interface CollectionCardProps {
  collection: FabricCollection
}

export function CollectionCard({ collection }: CollectionCardProps) {
  return (
    <Link href={`/collections/${collection.slug.current}`} className="block group">
      <article className="space-y-2">
        {collection.featuredImage && (
          <div className="aspect-[4/3] overflow-hidden bg-muted">
            <SanityImage
              image={collection.featuredImage.asset}
              alt={collection.name}
              width={600}
              height={450}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
        <div className="space-y-1">
          <h3 className="font-medium text-lg">{collection.name}</h3>
          {collection.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">{collection.description}</p>
          )}
          {collection.itemCount !== undefined && (
            <p className="text-sm text-muted-foreground">{collection.itemCount} items</p>
          )}
        </div>
      </article>
    </Link>
  )
}
