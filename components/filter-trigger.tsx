"use client"

interface FilterTriggerProps {
  onClick: () => void
  isOpen: boolean
}

export function FilterTrigger({ onClick, isOpen }: FilterTriggerProps) {
  return (
    <button
      onClick={onClick}
      className={`fixed left-0 top-1/2 -translate-y-1/2 z-40 px-3 py-8 bg-linen-100 hover:bg-linen-200 border-r border-t border-b border-border transition-colors shadow-sm ${
        isOpen ? "left-[320px]" : "left-0"
      } transition-all duration-300`}
      aria-label="Toggle filters"
    >
      <span className="text-xs font-sans tracking-wider -rotate-90 whitespace-nowrap block origin-center">
        FILTER BY
      </span>
    </button>
  )
}
