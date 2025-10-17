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

const NAV_HEIGHT = 80 // Height of the fixed navigation bar

export default function Page() {
  const [filterOpen, setFilterOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [showHero, setShowHero] = useState(true)
  const [hasPassedT1, setHasPassedT1] = useState(false) // 100px threshold
  const [hasPassedT2, setHasPassedT2] = useState(false) // viewport height - nav height threshold
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down")
  const [lastScrollY, setLastScrollY] = useState(0)
  const [heroOpacity, setHeroOpacity] = useState(1)
  const searchParams = useSearchParams()

  const hasActiveFilters =
    searchParams.has("collection") ||
    searchParams.has("colorway") ||
    searchParams.has("color") ||
    searchParams.has("material") ||
    searchParams.has("category")

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const viewportHeight = window.innerHeight
      const t2Threshold = viewportHeight - NAV_HEIGHT

      const fadeProgress = Math.min(currentScrollY / viewportHeight, 1)
      setHeroOpacity(1 - fadeProgress)

      if (currentScrollY > 100 && !hasPassedT1) {
        setHasPassedT1(true)
      }

      if (currentScrollY > t2Threshold && !hasPassedT2) {
        setHasPassedT2(true)
        setShowHero(false)
      }

      if (hasPassedT1 && !hasPassedT2) {
        if (currentScrollY > lastScrollY) {
          setScrollDirection("down")
        } else if (currentScrollY < lastScrollY) {
          setScrollDirection("up")
        }
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [hasPassedT1, hasPassedT2, lastScrollY])

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

  const contentMargin = activeCategory ? "400px" : "80px"

  return (
    <>
      <SiteHeader
        filterOpen={filterOpen}
        onFilterToggle={handleFilterToggle}
        hasPassedT1={hasPassedT1}
        hasPassedT2={hasPassedT2}
        scrollDirection={scrollDirection}
      />

      <div className="min-h-screen">
        <ActiveFiltersBar filterOpen={filterOpen} activeCategory={activeCategory} />

        <FilterPanel
          isOpen={filterOpen}
          activeCategory={activeCategory}
          onCategoryClick={handleCategoryClick}
          hasPassedT1={hasPassedT1}
          hasPassedT2={hasPassedT2}
          scrollDirection={scrollDirection}
        />

        <FilterSubPanel category={activeCategory} isOpen={!!activeCategory} onClose={() => setActiveCategory(null)} />

        <div
          className="transition-all duration-300"
          style={{
            marginLeft: contentMargin,
            paddingTop: hasPassedT1 ? `${NAV_HEIGHT}px` : "0",
          }}
        >
          {hasActiveFilters && <div className="h-24" />}

          <AnimatePresence mode="wait">
            {showHero && (
              <motion.div
                key="hero"
                initial={{ opacity: 1 }}
                animate={{ opacity: heroOpacity }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0 }}
              >
                <HeroGrid />
              </motion.div>
            )}
          </AnimatePresence>

          <FabricGrid hasScrolled={hasPassedT1} />
        </div>
      </div>
    </>
  )
}
