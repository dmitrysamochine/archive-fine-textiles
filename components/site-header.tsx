"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, X } from "lucide-react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"

interface SiteHeaderProps {
  hasPassedT1: boolean
  hasPassedT2: boolean
  scrollDirection: "up" | "down"
  skipInitialAnimation?: boolean
}

export function SiteHeader({
  hasPassedT1,
  hasPassedT2,
  scrollDirection,
  skipInitialAnimation = false,
}: SiteHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isTextilesActive = pathname === "/" || pathname.startsWith("/fabrics")
  const isOpenStockActive = pathname === "/open-stock"
  const isContactActive = pathname === "/contact-us"

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

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border"
        initial={skipInitialAnimation ? false : { y: -100, opacity: 0 }}
        animate={getAnimationState()}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="container mx-auto px-6 py-4">
          <nav className="flex items-center justify-between gap-8">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Image src="/logo.svg" alt="Archive Fine Textiles" width={216} height={48} className="h-12 w-auto" />
            </Link>

            {/* Search - Hide on mobile */}
            <div className="hidden md:flex flex-1 max-w-md">
              <div className="relative w-full">
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

            <div className="flex items-center gap-4 md:gap-6">
              <Link
                href="/?view=grid"
                className={`text-sm md:text-base font-heading hover:text-accent transition-colors ${
                  isTextilesActive ? "underline underline-offset-4" : ""
                }`}
              >
                Textiles
              </Link>
              <Link
                href="/open-stock"
                className={`text-sm md:text-base font-heading hover:text-accent transition-colors ${
                  isOpenStockActive ? "underline underline-offset-4" : ""
                }`}
              >
                Open Stock
              </Link>
              <Link
                href="/contact-us"
                className={`text-sm md:text-base font-heading hover:text-accent transition-colors ${
                  isContactActive ? "underline underline-offset-4" : ""
                }`}
              >
                Contact Us
              </Link>
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
                      type="search"
                      placeholder="Search fabrics..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-10 py-2 bg-muted/50 rounded-full text-sm focus:outline-none"
                      autoFocus
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
        </div>
      </motion.header>
    </>
  )
}
