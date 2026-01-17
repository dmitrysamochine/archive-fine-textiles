"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Search, X, Menu } from "lucide-react"

export function OpenStockHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const mobileSearchInputRef = useRef<HTMLInputElement>(null)

  const isTextiles = pathname === "/" || pathname.startsWith("/fabrics")
  const isOpenStock = pathname === "/open-stock"
  const isContact = pathname === "/contact-us"

  useEffect(() => {
    setMobileMenuOpen(false)
    setMobileSearchOpen(false)
  }, [pathname])

  useEffect(() => {
    if (mobileSearchOpen && mobileSearchInputRef.current) {
      mobileSearchInputRef.current.focus()
    }
  }, [mobileSearchOpen])

  useEffect(() => {
    const search = searchParams.get("search")
    if (search) setSearchQuery(search)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (searchQuery) {
        params.set("search", searchQuery)
      } else {
        params.delete("search")
      }
      router.push(`/open-stock?${params.toString()}`, { scroll: false })
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  return (
    <motion.header
      initial={{ y: 0, opacity: 1 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border"
    >
      <div className="container mx-auto px-6 py-4">
        <nav className="flex items-center justify-between gap-8">
          {/* Logo */}
          <Link href="/?view=grid" className="flex-shrink-0">
            <Image src="/logo.svg" alt="Archive Fine Textiles" width={216} height={48} className="h-12 w-auto" />
          </Link>

          {/* Search - Hide on mobile */}
          <div className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search open stock..."
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

          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/?view=grid"
              className={`text-base font-heading hover:text-accent transition-colors ${
                isTextiles ? "underline underline-offset-4" : ""
              }`}
            >
              Textiles
            </Link>
            <Link
              href="/open-stock"
              className={`text-base font-heading hover:text-accent transition-colors ${
                isOpenStock ? "underline underline-offset-4" : ""
              }`}
            >
              Open Stock
            </Link>
            <Link
              href="/contact-us"
              className={`text-base font-heading hover:text-accent transition-colors ${
                isContact ? "underline underline-offset-4" : ""
              }`}
            >
              Contact Us
            </Link>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => {
                setMobileSearchOpen(!mobileSearchOpen)
                setMobileMenuOpen(false)
              }}
              className="p-2 hover:bg-muted rounded-full transition-colors"
              aria-label="Toggle search"
            >
              {mobileSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen)
                setMobileSearchOpen(false)
              }}
              className="p-2 hover:bg-muted rounded-full transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {mobileSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="md:hidden overflow-hidden"
            >
              <div className="pt-4">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    ref={mobileSearchInputRef}
                    type="search"
                    placeholder="Search open stock..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 bg-muted/50 rounded-full text-sm focus:outline-none"
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
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="md:hidden overflow-hidden"
            >
              <div className="pt-4 pb-2 flex flex-col">
                <Link
                  href="/?view=grid"
                  className={`py-3 font-heading text-lg border-b border-border hover:bg-muted/50 transition-colors ${
                    isTextiles ? "underline underline-offset-4" : ""
                  }`}
                >
                  Textiles
                </Link>
                <Link
                  href="/open-stock"
                  className={`py-3 font-heading text-lg border-b border-border hover:bg-muted/50 transition-colors ${
                    isOpenStock ? "underline underline-offset-4" : ""
                  }`}
                >
                  Open Stock
                </Link>
                <Link
                  href="/contact-us"
                  className={`py-3 font-heading text-lg hover:bg-muted/50 transition-colors ${
                    isContact ? "underline underline-offset-4" : ""
                  }`}
                >
                  Contact Us
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}
