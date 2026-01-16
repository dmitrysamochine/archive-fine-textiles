"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"

export function ContactHeader() {
  const pathname = usePathname()
  const isTextilesActive = pathname === "/" || pathname.startsWith("/fabrics")
  const isOpenStockActive = pathname === "/open-stock"
  const isContactActive = pathname === "/contact-us"

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <nav className="flex items-center justify-between gap-8">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image src="/logo.svg" alt="Archive Fine Textiles" width={216} height={48} className="h-12 w-auto" />
          </Link>

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
      </div>
    </header>
  )
}
