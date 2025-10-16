"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { useSearchParams, useRouter } from "next/navigation"

interface SiteHeaderProps {
  filterOpen: boolean
  onFilterToggle: () => void
}

export function SiteHeader({ filterOpen, onFilterToggle }: SiteHeaderProps) {
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

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <nav className="flex items-center justify-between gap-8">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Image src="/logo.svg" alt="Archive Fine Textiles" width={180} height={40} className="h-8 w-auto" />
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
                  className="w-full pl-10 pr-10 py-2 bg-muted/50 border border-border rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-ring"
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
                className="flex items-center gap-2 text-sm hover:text-accent transition-colors"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filter</span>
                {activeFilterCount > 0 && (
                  <span className="flex items-center justify-center w-5 h-5 text-xs bg-primary text-primary-foreground rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              <Link href="/contact" className="text-sm hover:text-accent transition-colors">
                Contact Us
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-[73px]" />
    </>
  )
}
