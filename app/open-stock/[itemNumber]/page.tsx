import { notFound } from "next/navigation"
import { client } from "@/sanity/lib/client"
import { openStockItemByNumberQuery, openStockItemsQuery } from "@/sanity/lib/queries"
import { OpenStockItemDetail } from "@/components/open-stock-item-detail"
import type { OpenStockItem } from "@/sanity/types"

interface PageProps {
  params: Promise<{
    itemNumber: string
  }>
}

export async function generateStaticParams() {
  const items = await client.fetch<OpenStockItem[]>(openStockItemsQuery, {
    color: null,
    material: null,
  })

  return items.map((item) => ({
    itemNumber: item.itemNumber,
  }))
}

export default async function OpenStockDetailPage({ params }: PageProps) {
  const { itemNumber } = await params
  const item = await client.fetch<OpenStockItem>(openStockItemByNumberQuery, { itemNumber })

  if (!item) {
    notFound()
  }

  return <OpenStockItemDetail item={item} />
}
