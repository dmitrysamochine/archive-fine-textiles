import { client } from "@/sanity/lib/client"
import { fabricItemsQuery, fabricCollectionsQuery, colorsQuery } from "@/sanity/lib/queries"
import { FabricCard } from "@/components/fabric-card"
import type { FabricItem, FabricCollection, Color } from "@/sanity/types"

interface PageProps {
  searchParams: Promise<{
    collection?: string
    colorway?: string
    color?: string
    status?: string
    sort?: string
  }>
}

export default async function FabricsPage({ searchParams }: PageProps) {
  const params = await searchParams

  // Fetch fabrics with filters
  const fabrics = await client.fetch<FabricItem[]>(fabricItemsQuery, {
    collection: params.collection || null,
    colorway: params.colorway || null,
    color: params.color || null,
    status: params.status || null,
    sort: params.sort || "item-asc",
  })

  // Fetch filter options
  const [collections, colors] = await Promise.all([
    client.fetch<FabricCollection[]>(fabricCollectionsQuery),
    client.fetch<Color[]>(colorsQuery),
  ])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-serif font-bold">Fabrics</h1>
          <p className="text-muted-foreground mt-2">Browse our complete fabric catalog</p>
        </div>

        {/* Filter UI - Unstyled structure */}
        <div className="space-y-4 p-4 border rounded-lg">
          <p className="text-sm font-medium">Filters</p>
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="text-sm">Collection</label>
              {/* Filter controls will be styled later */}
            </div>
            <div>
              <label className="text-sm">Color</label>
              {/* Filter controls will be styled later */}
            </div>
            <div>
              <label className="text-sm">Status</label>
              {/* Filter controls will be styled later */}
            </div>
            <div>
              <label className="text-sm">Sort</label>
              {/* Sort controls will be styled later */}
            </div>
          </div>
        </div>

        {/* Results */}
        <div>
          <p className="text-sm text-muted-foreground mb-4">{fabrics.length} items</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {fabrics.map((item) => (
              <FabricCard key={item._id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
