"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { X, Menu } from "lucide-react"

export function ContactHeader() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isTextilesActive = pathname === "/" || pathname.startsWith("/fabrics")
  const isOpenStockActive = pathname === "/open-stock"
  const isContactActive = pathname === "/contact-us"

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <nav className="flex items-center justify-between gap-8">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image src="/logo.svg" alt="Archive Fine Textiles" width={216} height={48} className="h-12 w-auto" />
          </Link>

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
              Open Stock
            </Link>
            <Link
              href="/contact-us"
              className={`text-base font-heading hover:text-accent transition-colors ${
                isContactActive ? "underline underline-offset-4" : ""
              }`}
            >
              Contact Us
            </Link>
          </div>

          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 hover:bg-muted rounded-full transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

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
                  Open Stock
                </Link>
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
    </header>
  )
}
