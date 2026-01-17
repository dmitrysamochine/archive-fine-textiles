"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { notFound } from "next/navigation"
import { X } from "lucide-react"
import { client } from "@/sanity/lib/client"
import { fabricItemByNumberQuery } from "@/sanity/lib/queries"
import { FabricItemDetail } from "@/components/fabric-item-detail"
import { LoadingSpinner } from "@/components/loading-spinner"
import type { FabricItem } from "@/sanity/types"

interface PageProps {
  params: Promise<{
    itemNumber: string
  }>
}

export default function FabricDetailPage({ params }: PageProps) {
  const router = useRouter()
  const [item, setItem] = useState<FabricItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [itemNumber, setItemNumber] = useState<string | null>(null)

  useEffect(() => {
    params.then((p) => setItemNumber(p.itemNumber))
  }, [params])

  useEffect(() => {
    if (!itemNumber) return

    const fetchItem = async () => {
      const data = await client.fetch<FabricItem>(fabricItemByNumberQuery, { itemNumber })
      setItem(data)
      setLoading(false)
    }

    fetchItem()
  }, [itemNumber])

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <LoadingSpinner />
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
      <FabricItemDetail item={item} />
    </div>
  )
}
