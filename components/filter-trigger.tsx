"use client"

interface FilterTriggerProps {
  onClick: () => void
  isOpen: boolean
}

export function FilterTrigger({ onClick, isOpen }: FilterTriggerProps) {
  return (
    <button
      onClick={onClick}
      className={`fixed left-0 top-1/2 -translate-y-1/2 z-40 px-2 py-6 bg-linen-100 hover:bg-linen-200 border-r border-border transition-colors ${
        isOpen ? "left-[320px]" : "left-0"
      } transition-all duration-300`}
      aria-label="Toggle filters"
    >
      <span className="text-xs font-heading tracking-wider -rotate-90 whitespace-nowrap block origin-center">
        FILTER BY
      </span>
    </button>
  )
}
