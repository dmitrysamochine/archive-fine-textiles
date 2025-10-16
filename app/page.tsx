"use client"

import { useState, useRef } from "react"
import { HeroGrid } from "@/components/hero-grid"
import { FabricGrid } from "@/components/fabric-grid"
import { FilterPanel } from "@/components/filter-panel"
import { FilterSubPanel } from "@/components/filter-sub-panel"
import { ActiveFiltersBar } from "@/components/active-filters-bar"
import { SiteHeader } from "@/components/site-header"

export default function Page() {
  const [filterOpen, setFilterOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const mainPanelRef = useRef<HTMLElement>(null)

  const handleCategoryClick = (category: string) => {
    if (activeCategory === category) {
      setActiveCategory(null)
    } else {
      setActiveCategory(category)
    }
  }

  const handleFilterToggle = () => {
    setFilterOpen(!filterOpen)
    if (filterOpen) {
      setActiveCategory(null)
    }
  }

  return (
    <>
      <SiteHeader filterOpen={filterOpen} onFilterToggle={handleFilterToggle} />

      <div className="min-h-screen">
        <ActiveFiltersBar filterOpen={filterOpen} activeCategory={activeCategory} />

        <FilterPanel
          ref={mainPanelRef}
          isOpen={filterOpen}
          activeCategory={activeCategory}
          onCategoryClick={handleCategoryClick}
        />

        <FilterSubPanel
          category={activeCategory}
          isOpen={!!activeCategory}
          onClose={() => setActiveCategory(null)}
          mainPanelRef={mainPanelRef}
        />

        <div
          className="transition-all duration-300"
          style={{
            marginLeft: filterOpen ? (activeCategory ? "400px" : "80px") : "0",
          }}
        >
          <HeroGrid />
          <FabricGrid />
        </div>
      </div>
    </>
  )
}
