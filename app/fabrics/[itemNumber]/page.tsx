import { notFound } from "next/navigation"
import { client } from "@/sanity/lib/client"
import { fabricItemByNumberQuery, fabricItemsQuery } from "@/sanity/lib/queries"
import { SanityImage } from "@/lib/sanity-image"
import type { FabricItem } from "@/sanity/types"

interface PageProps {
  params: Promise<{
    itemNumber: string
  }>
}

export async function generateStaticParams() {
  const items = await client.fetch<FabricItem[]>(fabricItemsQuery, {
    collection: null,
    colorway: null,
    color: null,
    status: null,
    sort: "item-asc",
  })

  return items.map((item) => ({
    itemNumber: item.itemNumber,
  }))
}

export default async function FabricDetailPage({ params }: PageProps) {
  const { itemNumber } = await params
  const item = await client.fetch<FabricItem>(fabricItemByNumberQuery, { itemNumber })

  if (!item) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Images */}
          <div className="space-y-4">
            {item.images?.map((image, index) => (
              <div key={index} className="aspect-square bg-muted">
                <SanityImage
                  image={image.asset}
                  alt={image.alt || item.fabric.name}
                  width={800}
                  height={800}
                  className="w-full h-full object-cover"
                  priority={index === 0}
                />
              </div>
            ))}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-serif font-bold">{item.fabric.name}</h1>
              <p className="text-xl text-muted-foreground mt-2">{item.colorway.name}</p>
              <p className="text-sm text-muted-foreground mt-1">Item #{item.itemNumber}</p>
            </div>

            {item.price && (
              <div>
                <p className="text-2xl font-bold">${item.price}/yard</p>
              </div>
            )}

            <div className="space-y-4">
              {item.content && (
                <div>
                  <h3 className="font-medium mb-1">Content</h3>
                  <p className="text-sm">{item.content}</p>
                </div>
              )}
              {item.width && (
                <div>
                  <h3 className="font-medium mb-1">Width</h3>
                  <p className="text-sm">{item.width}</p>
                </div>
              )}
              {item.repeat && (
                <div>
                  <h3 className="font-medium mb-1">Repeat</h3>
                  <p className="text-sm">{item.repeat}</p>
                </div>
              )}
              {item.yardage && (
                <div>
                  <h3 className="font-medium mb-1">Available Yardage</h3>
                  <p className="text-sm">{item.yardage} yards</p>
                </div>
              )}
              {item.status && (
                <div>
                  <h3 className="font-medium mb-1">Status</h3>
                  <p className="text-sm capitalize">{item.status.replace("-", " ")}</p>
                </div>
              )}
              {item.colors && item.colors.length > 0 && (
                <div>
                  <h3 className="font-medium mb-1">Colors</h3>
                  <div className="flex flex-wrap gap-2">
                    {item.colors.map((color) => (
                      <span key={color.slug.current} className="text-sm px-2 py-1 bg-muted rounded">
                        {color.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
