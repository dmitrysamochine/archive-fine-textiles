import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { client } from "@/sanity/lib/client"
import { furnitureItemBySlugQuery, shopSettingsQuery } from "@/sanity/lib/queries"
import { SiteHeader } from "@/components/site-header"
import { FurnitureItemDetail } from "@/components/furniture-item-detail"
import type { FurnitureItem, ShopSettings } from "@/sanity/types"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const item = await client.fetch<FurnitureItem | null>(furnitureItemBySlugQuery, { slug })

  if (!item) {
    return { title: "Furniture | Archive Fine Textiles" }
  }

  return {
    title: `${item.title} — ${item.maker} | Archive Fine Textiles`,
    description:
      item.description ||
      `${item.title} by ${item.maker}${item.era ? `, ${item.era}` : ""}. A one-of-a-kind piece available by direct enquiry.`,
  }
}

export default async function FurnitureDetailPage({ params }: PageProps) {
  const { slug } = await params

  const [item, settings] = await Promise.all([
    client.fetch<FurnitureItem | null>(furnitureItemBySlugQuery, { slug }),
    client.fetch<ShopSettings | null>(shopSettingsQuery),
  ])

  if (!item) {
    notFound()
  }

  return (
    <>
      <SiteHeader showSearch={false} />
      <FurnitureItemDetail item={item} settings={settings} />
    </>
  )
}
