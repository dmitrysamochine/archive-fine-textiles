"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Search, X } from "lucide-react"

export function OpenStockHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const mobileSearchInputRef = useRef<HTMLInputElement>(null)

  const isTextiles = pathname === "/" || pathname.startsWith("/fabrics")
  const isOpenStock = pathname === "/open-stock"
  const isContact = pathname === "/contact-us"

  useEffect(() => {
    if (mobileSearchOpen && mobileSearchInputRef.current) {
      mobileSearchInputRef.current.focus()
    }
  }, [mobileSearchOpen])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      const params = new URLSearchParams(searchParams.toString())
      params.set("search", searchQuery.trim())
      router.push(`/open-stock?${params.toString()}`)
      setMobileSearchOpen(false)
    }
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    const params = new URLSearchParams(searchParams.toString())
    if (value.trim()) {
      params.set("search", value.trim())
    } else {
      params.delete("search")
    }
    router.push(`/open-stock?${params.toString()}`, { scroll: false })
  }

  return (
    <motion.header
      initial={{ y: 0, opacity: 1 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border"
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <Link href="/?view=grid" className="flex-shrink-0">
            <Image
              src="/archive-fine-textiles-logo.png"
              alt="Archive Fine Textiles"
              width={200}
              height={50}
              className="h-8 md:h-10 w-auto"
              priority
            />
          </Link>

          <nav className="flex items-center gap-4 md:gap-8">
            {/* Desktop Search */}
            <form onSubmit={handleSearch} className="hidden md:block relative">
              <input
                type="text"
                placeholder="Search open stock..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-48 lg:w-64 px-4 py-2 text-sm bg-muted rounded-full focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </form>

            {/* Mobile Search Toggle */}
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="md:hidden p-2 hover:bg-muted rounded-full transition-colors"
              aria-label="Toggle search"
            >
              {mobileSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </button>

            <Link
              href="/?view=grid"
              className={`text-sm md:text-base font-sans hover:text-foreground transition-colors ${
                isTextiles ? "text-foreground border-b border-foreground" : "text-muted-foreground"
              }`}
            >
              Textiles
            </Link>
            <Link
              href="/open-stock"
              className={`text-sm md:text-base font-sans hover:text-foreground transition-colors ${
                isOpenStock ? "text-foreground border-b border-foreground" : "text-muted-foreground"
              }`}
            >
              Open Stock
            </Link>
            <Link
              href="/contact-us"
              className={`text-sm md:text-base font-sans hover:text-foreground transition-colors ${
                isContact ? "text-foreground border-b border-foreground" : "text-muted-foreground"
              }`}
            >
              Contact Us
            </Link>
          </nav>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <AnimatePresence>
        {mobileSearchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-border overflow-hidden"
          >
            <form onSubmit={handleSearch} className="container mx-auto px-6 py-3">
              <input
                ref={mobileSearchInputRef}
                type="text"
                placeholder="Search open stock..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full px-4 py-2 text-sm bg-muted rounded-full focus:outline-none"
              />
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
