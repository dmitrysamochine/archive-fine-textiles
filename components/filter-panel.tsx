"use client"

import { motion } from "framer-motion"
import { Layers, Palette, Shirt, Tag } from "lucide-react"
import { forwardRef } from "react"

interface FilterPanelProps {
  isOpen: boolean
  activeCategory: string | null
  onCategoryClick: (category: string) => void
  hasPassedT1: boolean
  hasPassedT2: boolean
  scrollDirection: "up" | "down"
}

const categories = [
  { id: "collection", label: "Collection", icon: Layers },
  { id: "colorway", label: "Colorway", icon: Palette },
  { id: "color", label: "Color", icon: Palette },
  { id: "material", label: "Material", icon: Shirt },
  { id: "category", label: "Categories", icon: Tag },
]

export const FilterPanel = forwardRef<HTMLElement, FilterPanelProps>(
  ({ isOpen, activeCategory, onCategoryClick, hasPassedT1, hasPassedT2, scrollDirection }, ref) => {
    const getAnimationState = () => {
      if (!hasPassedT1) {
        // Before T1: hidden
        return { x: "-100%", opacity: 0 }
      } else if (hasPassedT1 && !hasPassedT2) {
        // Between T1 and T2: show/hide based on scroll direction
        return {
          x: scrollDirection === "down" ? 0 : "-100%",
          opacity: scrollDirection === "down" ? 1 : 0,
        }
      } else {
        // After T2: always visible
        return { x: 0, opacity: 1 }
      }
    }

    return (
      <motion.aside
        ref={ref}
        initial={{ x: "-100%", opacity: 0 }}
        animate={getAnimationState()}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed left-0 top-[73px] bottom-0 w-20 bg-cream-50 border-r border-border z-40 hidden lg:flex flex-col"
      >
        <div className="flex-1 py-6">
          {categories.map((cat) => {
            const Icon = cat.icon
            const isActive = activeCategory === cat.id

            return (
              <button
                key={cat.id}
                onClick={() => onCategoryClick(cat.id)}
                className={`w-full px-3 py-4 flex flex-col items-center gap-2 transition-colors ${
                  isActive
                    ? "bg-linen-100 text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-linen-50"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px] text-center leading-tight">{cat.label}</span>
              </button>
            )
          })}
        </div>
      </motion.aside>
    )
  },
)

FilterPanel.displayName = "FilterPanel"
