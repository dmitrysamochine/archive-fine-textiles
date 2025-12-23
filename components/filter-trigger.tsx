"use client"

import { motion, AnimatePresence } from "framer-motion"

interface FilterTriggerProps {
  onClick: () => void
  isOpen: boolean
  hasPassedT1: boolean
  hasActiveFilters: boolean
}

export function FilterTrigger({ onClick, isOpen, hasPassedT1, hasActiveFilters }: FilterTriggerProps) {
  const topPosition = hasActiveFilters ? 153 : 80

  return (
    <AnimatePresence>
      {hasPassedT1 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{
            opacity: isOpen ? 0 : 1,
            left: isOpen ? 320 : 0,
            top: topPosition,
          }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: isOpen ? 0.15 : 0.2 },
            left: { type: "spring", damping: 30, stiffness: 300 },
            top: { duration: 0.3 },
          }}
          onClick={onClick}
          className="fixed left-0 z-40 px-3 py-8 bg-linen-100 hover:bg-linen-200 border-r border-t border-b border-border transition-colors shadow-sm"
          aria-label="Toggle filters"
        >
          <span className="text-xs font-sans tracking-wider -rotate-90 whitespace-nowrap block origin-center">
            FILTERS
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
