import { client } from "@/sanity/lib/client"
import { fabricCollectionsQuery } from "@/sanity/lib/queries"
import { CollectionCard } from "@/components/collection-card"
import type { FabricCollection } from "@/sanity/types"

export default async function CollectionsPage() {
  const collections = await client.fetch<FabricCollection[]>(fabricCollectionsQuery)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-serif font-bold">Collections</h1>
          <p className="text-muted-foreground mt-2">Explore our curated fabric collections</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <CollectionCard key={collection._id} collection={collection} />
          ))}
        </div>
      </div>
    </div>
  )
}
