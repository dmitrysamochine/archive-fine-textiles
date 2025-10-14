import { notFound } from "next/navigation"
import { client } from "@/sanity/lib/client"
import { colorwayBySlugQuery, colorwaysQuery } from "@/sanity/lib/queries"
import { FabricCard } from "@/components/fabric-card"
import type { Colorway } from "@/sanity/types"

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const colorways = await client.fetch<Colorway[]>(colorwaysQuery)

  return colorways.map((colorway) => ({
    slug: colorway.slug.current,
  }))
}

export default async function ColorwayDetailPage({ params }: PageProps) {
  const { slug } = await params
  const colorway = await client.fetch<Colorway>(colorwayBySlugQuery, { slug })

  if (!colorway) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Colorway Header */}
        <div>
          <h1 className="text-3xl font-serif font-bold">{colorway.name}</h1>
          {colorway.description && <p className="text-muted-foreground mt-2">{colorway.description}</p>}
        </div>

        {/* Items */}
        {colorway.items && colorway.items.length > 0 && (
          <div>
            <p className="text-sm text-muted-foreground mb-4">{colorway.items.length} items</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {colorway.items.map((item) => (
                <FabricCard key={item._id} item={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
