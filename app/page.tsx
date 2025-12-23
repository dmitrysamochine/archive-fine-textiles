"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { HeroGrid } from "@/components/hero-grid"
import { FabricGrid } from "@/components/fabric-grid"
import { ActiveFiltersBar } from "@/components/active-filters-bar"
import { SiteHeader } from "@/components/site-header"
import { FabricDetailModal } from "@/components/fabric-detail-modal"
import { FilterDrawer } from "@/components/filter-drawer"
import { FilterTrigger } from "@/components/filter-trigger"

const NAV_HEIGHT = 80

export default function Page() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const searchParams = useSearchParams()
  const [showHero, setShowHero] = useState(!searchParams.toString())
  const [hasPassedT1, setHasPassedT1] = useState(!searchParams.toString() ? false : true)
  const [hasPassedT2, setHasPassedT2] = useState(!searchParams.toString() ? false : true)
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down")
  const [lastScrollY, setLastScrollY] = useState(0)
  const [heroOpacity, setHeroOpacity] = useState(1)
  const [selectedFabricId, setSelectedFabricId] = useState<string | null>(null)
  const router = useRouter()

  const hasActiveFilters = searchParams.has("collection") || searchParams.has("color") || searchParams.has("material")

  useEffect(() => {
    const fabricParam = searchParams.get("fabric")
    if (fabricParam) {
      setSelectedFabricId(fabricParam)
    }
  }, [searchParams])

  useEffect(() => {
    const handleScroll = () => {
      if (!showHero) return

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
  }, [hasPassedT1, hasPassedT2, lastScrollY, showHero])

  const handleFabricClick = (itemNumber: string) => {
    setSelectedFabricId(itemNumber)
    const params = new URLSearchParams(searchParams.toString())
    params.set("fabric", itemNumber)
    router.push(`?${params.toString()}`, { scroll: false })
  }

  const handleModalClose = () => {
    setSelectedFabricId(null)
    const params = new URLSearchParams(searchParams.toString())
    params.delete("fabric")
    const newUrl = params.toString() ? `?${params.toString()}` : "/"
    router.push(newUrl, { scroll: false })
  }

  return (
    <>
      <SiteHeader hasPassedT1={hasPassedT1} hasPassedT2={hasPassedT2} scrollDirection={scrollDirection} />

      <FilterTrigger
        onClick={() => setDrawerOpen(!drawerOpen)}
        isOpen={drawerOpen}
        hasPassedT1={hasPassedT1}
        hasActiveFilters={hasActiveFilters}
      />
      <FilterDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} hasActiveFilters={hasActiveFilters} />

      <div className="min-h-screen">
        <ActiveFiltersBar />

        <div
          className="transition-all duration-300"
          style={{
            paddingTop: hasPassedT1 ? `${NAV_HEIGHT}px` : "0",
          }}
        >
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

          <div
            className="transition-all duration-300"
            style={{
              paddingTop: hasActiveFilters ? "65px" : "0",
            }}
          >
            <FabricGrid hasScrolled={hasPassedT1} onFabricClick={handleFabricClick} />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedFabricId && <FabricDetailModal itemNumber={selectedFabricId} onClose={handleModalClose} />}
      </AnimatePresence>
    </>
  )
}
