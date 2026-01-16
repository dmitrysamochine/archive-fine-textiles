"use client"

import { motion } from "framer-motion"
import { SlidersHorizontal } from "lucide-react"

interface OpenStockFilterTriggerProps {
  onClick: () => void
  isOpen: boolean
  hasActiveFilters: boolean
}

export function OpenStockFilterTrigger({ onClick, isOpen, hasActiveFilters }: OpenStockFilterTriggerProps) {
  const topPosition = hasActiveFilters ? 144 : 79

  return (
    <>
      {/* Desktop: Vertical button on left edge */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{
          opacity: isOpen ? 0 : 1,
          left: isOpen ? 320 : 0,
          top: topPosition,
        }}
        transition={{
          opacity: { duration: isOpen ? 0.15 : 0.2 },
          left: { type: "spring", damping: 30, stiffness: 300 },
          top: { duration: 0.3 },
        }}
        onClick={onClick}
        className="hidden md:block fixed left-0 z-40 px-3 py-10 bg-linen-100 hover:bg-linen-200 border border-border transition-colors"
        aria-label="Toggle filters"
      >
        <span className="text-xs font-sans tracking-wider -rotate-90 whitespace-nowrap block origin-center">
          FILTERS
        </span>
      </motion.button>

      {/* Mobile: FAB in bottom-right corner */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: isOpen ? 0 : 1,
          scale: isOpen ? 0.8 : 1,
        }}
        transition={{
          opacity: { duration: 0.2 },
          scale: { type: "spring", damping: 20, stiffness: 300 },
        }}
        onClick={onClick}
        className="md:hidden fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-steel-600 hover:bg-steel-700 text-white shadow-lg flex items-center justify-center transition-colors"
        aria-label="Toggle filters"
      >
        <SlidersHorizontal className="h-5 w-5" />
      </motion.button>
    </>
  )
}
