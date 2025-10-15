"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Search, SlidersHorizontal } from "lucide-react"
import { FilterPanel } from "./filter-panel"

export function SiteHeader() {
  const [filterOpen, setFilterOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

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
                  className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            {/* Filter + Contact */}
            <div className="flex items-center gap-6">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex items-center gap-2 text-sm hover:text-accent transition-colors"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filter
              </button>
              <Link href="/contact" className="text-sm hover:text-accent transition-colors">
                Contact Us
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Filter Dropdown Panel */}
      <FilterPanel isOpen={filterOpen} onClose={() => setFilterOpen(false)} />

      {/* Spacer for fixed header */}
      <div className="h-[73px]" />
    </>
  )
}
