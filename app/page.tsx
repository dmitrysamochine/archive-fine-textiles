"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { HeroGrid } from "@/components/hero-grid"
import { FabricGrid } from "@/components/fabric-grid"
import { FilterPanel } from "@/components/filter-panel"
import { FilterSubPanel } from "@/components/filter-sub-panel"
import { ActiveFiltersBar } from "@/components/active-filters-bar"
import { SiteHeader } from "@/components/site-header"

export default function Page() {
  const [filterOpen, setFilterOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [showHero, setShowHero] = useState(true)
  const [hasScrolled, setHasScrolled] = useState(false)
  const searchParams = useSearchParams()

  const hasActiveFilters =
    searchParams.has("collection") ||
    searchParams.has("colorway") ||
    searchParams.has("color") ||
    searchParams.has("material") ||
    searchParams.has("category")

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 100
      setHasScrolled(scrolled)

      // Once scrolled past hero, hide it permanently
      if (scrolled && showHero) {
        setShowHero(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [showHero])

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
      <SiteHeader filterOpen={filterOpen} onFilterToggle={handleFilterToggle} hasScrolled={hasScrolled} />

      <div className="min-h-screen">
        <ActiveFiltersBar filterOpen={filterOpen} activeCategory={activeCategory} />

        <FilterPanel isOpen={filterOpen} activeCategory={activeCategory} onCategoryClick={handleCategoryClick} />

        <FilterSubPanel category={activeCategory} isOpen={!!activeCategory} onClose={() => setActiveCategory(null)} />

        <div
          className="transition-all duration-300"
          style={{
            marginLeft: filterOpen ? (activeCategory ? "400px" : "80px") : "0",
          }}
        >
          {hasActiveFilters && <div className="h-24" />}

          <AnimatePresence mode="wait">
            {showHero && (
              <motion.div key="hero" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
                <HeroGrid />
              </motion.div>
            )}
          </AnimatePresence>

          <FabricGrid />
        </div>
      </div>
    </>
  )
}
