import { notFound } from "next/navigation"
import { client } from "@/sanity/lib/client"
import { fabricCollectionBySlugQuery, fabricCollectionsQuery } from "@/sanity/lib/queries"
import { FabricCard } from "@/components/fabric-card"
import { SanityImage } from "@/lib/sanity-image"
import type { FabricCollection } from "@/sanity/types"

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const collections = await client.fetch<FabricCollection[]>(fabricCollectionsQuery)

  return collections.map((collection) => ({
    slug: collection.slug.current,
  }))
}

export default async function CollectionDetailPage({ params }: PageProps) {
  const { slug } = await params
  const collection = await client.fetch<FabricCollection>(fabricCollectionBySlugQuery, { slug })

  if (!collection) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Collection Header */}
        <div className="space-y-4">
          {collection.featuredImage && (
            <div className="aspect-[21/9] max-h-96 overflow-hidden bg-muted">
              <SanityImage
                image={collection.featuredImage.asset}
                alt={collection.name}
                width={1200}
                height={400}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-serif font-bold">{collection.name}</h1>
            {collection.description && <p className="text-muted-foreground mt-2">{collection.description}</p>}
          </div>
        </div>

        {/* Items */}
        {collection.items && collection.items.length > 0 && (
          <div>
            <p className="text-sm text-muted-foreground mb-4">{collection.items.length} items</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {collection.items.map((item) => (
                <FabricCard key={item._id} item={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
