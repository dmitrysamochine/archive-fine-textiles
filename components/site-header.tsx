"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, X, Menu } from "lucide-react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"

interface ScrollAnimationProps {
  hasPassedT1: boolean
  hasPassedT2: boolean
  scrollDirection: "up" | "down"
  skipInitialAnimation?: boolean
}

interface SiteHeaderProps {
  scrollAnimation?: ScrollAnimationProps
  showSearch?: boolean
  searchPath?: string
}

export function SiteHeader({
  scrollAnimation,
  showSearch = true,
  searchPath = "/",
}: SiteHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const mobileSearchInputRef = useRef<HTMLInputElement>(null)

  const isTextilesActive = pathname === "/" || pathname.startsWith("/fabrics")
  const isOpenStockActive = pathname === "/open-stock" || pathname.startsWith("/open-stock/")
  const isShopActive = pathname.startsWith("/shop")
  const isContactActive = pathname === "/contact-us"

  // Temporarily hide the Shop link from the nav while furniture content is being
  // populated. The /shop routes remain live and directly accessible — set this to
  // true to surface the link again.
  const SHOW_SHOP_LINK = false

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false)
    setMobileSearchOpen(false)
  }, [pathname])

  // Focus mobile search input when opened
  useEffect(() => {
    if (mobileSearchOpen && mobileSearchInputRef.current) {
      mobileSearchInputRef.current.focus()
    }
  }, [mobileSearchOpen])

  // Sync search query from URL on mount
  useEffect(() => {
    const search = searchParams.get("search")
    if (search) setSearchQuery(search)
  }, [])

  // Debounced search
  useEffect(() => {
    if (!showSearch) return

    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (searchQuery) {
        params.set("search", searchQuery)
      } else {
        params.delete("search")
      }
      router.push(`${searchPath}?${params.toString()}`, { scroll: false })
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery, showSearch])

  // Scroll animation logic
  const getAnimationState = () => {
    if (!scrollAnimation) {
      return { y: 0, opacity: 1 }
    }

    const { hasPassedT1, hasPassedT2, scrollDirection } = scrollAnimation

    if (!hasPassedT1) {
      return { y: -100, opacity: 0 }
    } else if (hasPassedT1 && !hasPassedT2) {
      return {
        y: scrollDirection === "down" ? 0 : -100,
        opacity: scrollDirection === "down" ? 1 : 0,
      }
    } else {
      return { y: 0, opacity: 1 }
    }
  }

  const shouldSkipInitialAnimation = scrollAnimation?.skipInitialAnimation ?? true

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border"
      initial={shouldSkipInitialAnimation ? false : { y: -100, opacity: 0 }}
      animate={getAnimationState()}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="container mx-auto px-6 py-4">
        <nav className="flex items-center justify-between gap-8">
          {/* Logo */}
          <Link href="/?view=grid" className="flex-shrink-0">
            <Image src="/logo.svg" alt="Archive Fine Textiles" width={216} height={48} className="h-12 w-auto" />
          </Link>

          {/* Search - Desktop */}
          {showSearch && (
            <div className="hidden md:flex flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="search"
                  placeholder={searchPath === "/open-stock" ? "Search open stock..." : "Search fabrics..."}
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
          )}

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/?view=grid"
              className={`text-base font-heading hover:text-accent transition-colors ${
                isTextilesActive ? "underline underline-offset-4" : ""
              }`}
            >
              Textiles
            </Link>
            <Link
              href="/open-stock"
              className={`text-base font-heading hover:text-accent transition-colors ${
                isOpenStockActive ? "underline underline-offset-4" : ""
              }`}
            >
              Open Stock Fabrics
            </Link>
            {SHOW_SHOP_LINK && (
              <Link
                href="/shop/furniture"
                className={`text-base font-heading hover:text-accent transition-colors ${
                  isShopActive ? "underline underline-offset-4" : ""
                }`}
              >
                Shop
              </Link>
            )}
            <Link
              href="/contact-us"
              className={`text-base font-heading hover:text-accent transition-colors ${
                isContactActive ? "underline underline-offset-4" : ""
              }`}
            >
              Contact Us
            </Link>
          </div>

          {/* Mobile Controls */}
          <div className="flex md:hidden items-center gap-2">
            {showSearch && (
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
            )}
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

        {/* Mobile Search */}
        {showSearch && (
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
                      placeholder={searchPath === "/open-stock" ? "Search open stock..." : "Search fabrics..."}
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
        )}

        {/* Mobile Menu */}
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
                    isTextilesActive ? "underline underline-offset-4" : ""
                  }`}
                >
                  Textiles
                </Link>
                <Link
                  href="/open-stock"
                  className={`py-3 font-heading text-lg border-b border-border hover:bg-muted/50 transition-colors ${
                    isOpenStockActive ? "underline underline-offset-4" : ""
                  }`}
                >
                  Open Stock Fabrics
                </Link>
                {SHOW_SHOP_LINK && (
                  <Link
                    href="/shop/furniture"
                    className={`py-3 font-heading text-lg border-b border-border hover:bg-muted/50 transition-colors ${
                      isShopActive ? "underline underline-offset-4" : ""
                    }`}
                  >
                    Shop
                  </Link>
                )}
                <Link
                  href="/contact-us"
                  className={`py-3 font-heading text-lg hover:bg-muted/50 transition-colors ${
                    isContactActive ? "underline underline-offset-4" : ""
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
