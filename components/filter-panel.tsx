"use client"

import { motion } from "framer-motion"
import { Layers, Palette, Shirt, Tag } from "lucide-react"

interface FilterPanelProps {
  isOpen: boolean
  activeCategory: string | null
  onCategoryClick: (category: string) => void
}

const categories = [
  { id: "collection", label: "Collection", icon: Layers },
  { id: "colorway", label: "Colorway", icon: Palette },
  { id: "color", label: "Color", icon: Palette },
  { id: "material", label: "Material", icon: Shirt },
  { id: "category", label: "Categories", icon: Tag },
]

export function FilterPanel({ isOpen, activeCategory, onCategoryClick }: FilterPanelProps) {
  return (
    <motion.aside
      initial={false}
      animate={{ x: isOpen ? 0 : "-100%" }}
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
}
