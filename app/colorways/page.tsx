import { client } from "@/sanity/lib/client"
import { colorwaysQuery } from "@/sanity/lib/queries"
import { ColorwayCard } from "@/components/colorway-card"
import type { Colorway } from "@/sanity/types"

export default async function ColorwaysPage() {
  const colorways = await client.fetch<Colorway[]>(colorwaysQuery)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-serif font-bold">Colorways</h1>
          <p className="text-muted-foreground mt-2">Browse fabrics by colorway</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {colorways.map((colorway) => (
            <ColorwayCard key={colorway._id} colorway={colorway} />
          ))}
        </div>
      </div>
    </div>
  )
}
