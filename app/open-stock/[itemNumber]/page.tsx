"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { notFound } from "next/navigation"
import { X } from "lucide-react"
import { client } from "@/sanity/lib/client"
import { openStockItemByNumberQuery } from "@/sanity/lib/queries"
import { OpenStockItemDetail } from "@/components/open-stock-item-detail"
import { LoadingSpinner } from "@/components/loading-spinner"
import type { OpenStockItem } from "@/sanity/types"

interface PageProps {
  params: Promise<{
    itemNumber: string
  }>
}

export default function OpenStockDetailPage({ params }: PageProps) {
  const router = useRouter()
  const [item, setItem] = useState<OpenStockItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [itemNumber, setItemNumber] = useState<string | null>(null)

  useEffect(() => {
    params.then((p) => setItemNumber(p.itemNumber))
  }, [params])

  useEffect(() => {
    if (!itemNumber) return

    const fetchItem = async () => {
      const data = await client.fetch<OpenStockItem>(openStockItemByNumberQuery, { itemNumber })
      setItem(data)
      setLoading(false)
    }

    fetchItem()
  }, [itemNumber])

  if (loading) {
    return (
      <div className="relative">
        <button
          onClick={() => router.back()}
          className="fixed top-6 right-6 z-[60] bg-black/80 hover:bg-black text-white p-3 rounded-full shadow-lg transition-colors"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>
        <div className="relative w-full md:h-screen md:overflow-hidden">
          <div className="flex flex-col md:flex-row md:h-full">
            {/* Info Panel placeholder */}
            <div className="w-full md:absolute md:right-0 md:top-0 md:bottom-0 md:w-96 bg-background md:bg-background/95 md:backdrop-blur-sm p-8 overflow-y-auto md:z-20 md:shadow-xl">
              <div className="space-y-6">
                <div className="h-8 w-48 bg-muted animate-pulse rounded" />
                <div className="h-6 w-32 bg-muted animate-pulse rounded" />
              </div>
            </div>
            {/* Image area with centered spinner */}
            <div className="relative w-full h-[70vh] md:h-full md:w-[calc(100%-24rem)] bg-white flex items-center justify-center">
              <LoadingSpinner />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!item) {
    notFound()
  }

  return (
    <div className="relative">
      <button
        onClick={() => router.back()}
        className="fixed top-6 right-6 z-[60] bg-black/80 hover:bg-black text-white p-3 rounded-full shadow-lg transition-colors"
        aria-label="Close"
      >
        <X className="h-6 w-6" />
      </button>
      <OpenStockItemDetail item={item} />
    </div>
  )
}
