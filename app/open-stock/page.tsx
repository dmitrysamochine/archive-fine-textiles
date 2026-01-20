"use client"

import { Suspense, useState } from "react"
import { useSearchParams } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { OpenStockGrid } from "@/components/open-stock-grid"
import { OpenStockFilterDrawer } from "@/components/open-stock-filter-drawer"
import { OpenStockFilterTrigger } from "@/components/open-stock-filter-trigger"
import { OpenStockActiveFiltersBar } from "@/components/open-stock-active-filters-bar"

const NAV_HEIGHT = 80

function OpenStockContent() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const searchParams = useSearchParams()

  const hasParams = searchParams.toString().length > 0
  const hasActiveFilters = searchParams.has("color") || searchParams.has("material")

  return (
    <>
      <SiteHeader showSearch={true} searchPath="/open-stock" />

      <OpenStockFilterTrigger
        onClick={() => setDrawerOpen(!drawerOpen)}
        isOpen={drawerOpen}
        hasActiveFilters={hasActiveFilters}
      />
      <OpenStockFilterDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        hasActiveFilters={hasActiveFilters}
      />

      <div className="min-h-screen">
        <OpenStockActiveFiltersBar />

        <div
          className="transition-all duration-300"
          style={{
            paddingTop: `${NAV_HEIGHT}px`,
          }}
        >
          <div
            className="transition-all duration-300"
            style={{
              paddingTop: hasActiveFilters ? "65px" : "0",
            }}
          >
            <OpenStockGrid />
          </div>
        </div>
      </div>
    </>
  )
}

export default function OpenStockPage() {
  return (
    <Suspense fallback={null}>
      <OpenStockContent />
    </Suspense>
  )
}
