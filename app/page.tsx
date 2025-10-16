"use client"

import { useState } from "react"
import { HeroGrid } from "@/components/hero-grid"
import { FabricGrid } from "@/components/fabric-grid"
import { FilterPanel } from "@/components/filter-panel"
import { SiteHeader } from "@/components/site-header"

export default function Page() {
  const [filterOpen, setFilterOpen] = useState(false)

  return (
    <>
      <SiteHeader filterOpen={filterOpen} onFilterToggle={() => setFilterOpen(!filterOpen)} />

      <div className="min-h-screen">
        <FilterPanel isOpen={filterOpen} onClose={() => setFilterOpen(false)} />

        <div
          className="transition-all duration-300"
          style={{
            marginLeft: filterOpen ? "320px" : "0",
          }}
        >
          <HeroGrid />
          <FabricGrid />
        </div>
      </div>
    </>
  )
}
