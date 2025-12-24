import { notFound } from "next/navigation"
import { client } from "@/sanity/lib/client"
import { fabricItemByNumberQuery, fabricItemsQuery } from "@/sanity/lib/queries"
import { FabricItemDetail } from "@/components/fabric-item-detail"
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
    material: null,
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

  return <FabricItemDetail item={item} />
}
