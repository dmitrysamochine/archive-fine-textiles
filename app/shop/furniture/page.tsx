import type { Metadata } from "next"
import { client } from "@/sanity/lib/client"
import { furnitureItemsQuery, shopSettingsQuery } from "@/sanity/lib/queries"
import { SiteHeader } from "@/components/site-header"
import { FurnitureFeatureRow } from "@/components/furniture-feature-row"
import type { FurnitureItem, ShopSettings } from "@/sanity/types"

export const metadata: Metadata = {
  title: "Furniture | Archive Fine Textiles",
  description:
    "A curated selection of one-of-a-kind vintage and designer furniture. Each piece is available by direct enquiry.",
}

export default async function FurniturePage() {
  const [items, settings] = await Promise.all([
    client.fetch<FurnitureItem[]>(furnitureItemsQuery),
    client.fetch<ShopSettings | null>(shopSettingsQuery),
  ])

  const intro =
    settings?.furnitureIntro ||
    "A curated selection of one-of-a-kind pieces. Each is available by direct enquiry — contact us to purchase or arrange a viewing."

  return (
    <>
      <SiteHeader showSearch={false} />

      <main className="min-h-screen pt-28 pb-8">
        <div className="container mx-auto px-4 md:px-6">
          {/* Section header */}
          <header className="max-w-2xl ml-auto text-right mb-12 md:mb-16">
            <h1 className="text-2xl md:text-3xl font-heading mb-4 text-balance">Furniture</h1>
            <p className="text-base font-sans leading-relaxed text-muted-foreground text-pretty">{intro}</p>
          </header>

          {/* Editorial showcase */}
          {items.length > 0 ? (
            <div>
              {items.map((item, index) => (
                <FurnitureFeatureRow key={item._id} item={item} index={index} />
              ))}
            </div>
          ) : (
            <div className="border-t border-border py-20 text-center">
              <p className="text-muted-foreground font-sans">
                Our furniture collection is being prepared. Please check back soon.
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
