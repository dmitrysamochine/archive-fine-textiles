"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { useSearchParams, useRouter } from "next/navigation"

interface SiteHeaderProps {
  filterOpen: boolean
  onFilterToggle: () => void
  hasPassedT1: boolean
  hasPassedT2: boolean
  scrollDirection: "up" | "down"
}

export function SiteHeader({ filterOpen, onFilterToggle, hasPassedT1, hasPassedT2, scrollDirection }: SiteHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const searchParams = useSearchParams()
  const router = useRouter()

  const activeFilterCount = [
    searchParams.get("collection"),
    searchParams.get("colorway"),
    searchParams.get("color"),
    searchParams.get("material"),
    searchParams.get("category"),
  ].filter(Boolean).length

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        const params = new URLSearchParams(searchParams.toString())
        params.set("search", searchQuery)
        router.push(`/?${params.toString()}`, { scroll: false })
      } else {
        const params = new URLSearchParams(searchParams.toString())
        params.delete("search")
        router.push(`/?${params.toString()}`, { scroll: false })
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    const search = searchParams.get("search")
    if (search) setSearchQuery(search)
  }, [])

  const getAnimationState = () => {
    if (!hasPassedT1) {
      // Before T1: hidden
      return { y: -100, opacity: 0 }
    } else if (hasPassedT1 && !hasPassedT2) {
      // Between T1 and T2: show/hide based on scroll direction
      return {
        y: scrollDirection === "down" ? 0 : -100,
        opacity: scrollDirection === "down" ? 1 : 0,
      }
    } else {
      // After T2: always visible
      return { y: 0, opacity: 1 }
    }
  }

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border"
        initial={{ y: -100, opacity: 0 }}
        animate={getAnimationState()}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="container mx-auto px-6 py-4">
          <nav className="flex items-center justify-between gap-8">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Image src="/logo.svg" alt="Archive Fine Textiles" width={216} height={48} className="h-12 w-auto" />
            </Link>

            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search fabrics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 bg-muted/50 border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Filter + Contact */}
            <div className="flex items-center gap-6">
              <button
                onClick={onFilterToggle}
                className="flex items-center gap-2 text-sm font-heading hover:text-accent transition-colors"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filter</span>
                {activeFilterCount > 0 && (
                  <span className="flex items-center justify-center w-5 h-5 text-xs bg-primary text-primary-foreground rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              <Link href="/contact" className="text-sm font-heading hover:text-accent transition-colors">
                Contact Us
              </Link>
            </div>
          </nav>
        </div>
      </motion.header>
    </>
  )
}
