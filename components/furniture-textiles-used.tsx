"use client"

import { useState } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { FurnitureImage } from "@/components/furniture-image"
import type { FurnitureItem } from "@/sanity/types"

type TextileImage = NonNullable<FurnitureItem["textilesUsed"]>[number]

interface FurnitureTextilesUsedProps {
  textiles: TextileImage[]
  itemTitle: string
}

export function FurnitureTextilesUsed({ textiles, itemTitle }: FurnitureTextilesUsedProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  if (!textiles || textiles.length === 0) return null

  const activeTextile = openIndex !== null ? textiles[openIndex] : null

  return (
    <div className="flex flex-col gap-2">
      <span className="text-muted-foreground uppercase tracking-wider text-xs">Textiles Used</span>
      <div className="flex flex-wrap gap-3 pt-1">
        {textiles.map((textile, i) => (
          <button
            key={textile.asset?._id || i}
            type="button"
            onClick={() => setOpenIndex(i)}
            className="w-16 h-16 overflow-hidden bg-muted transition-opacity opacity-90 hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label={`View textile ${i + 1} used on ${itemTitle}`}
          >
            <FurnitureImage
              image={textile}
              alt={textile.alt || `Textile ${i + 1} used on ${itemTitle}`}
              width={128}
              height={128}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      <Dialog.Root open={openIndex !== null} onOpenChange={(open) => !open && setOpenIndex(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-foreground/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 focus:outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95">
            <Dialog.Title className="sr-only">
              {activeTextile?.alt || `Textile used on ${itemTitle}`}
            </Dialog.Title>
            {activeTextile && (
              <FurnitureImage
                image={activeTextile}
                alt={activeTextile.alt || `Textile used on ${itemTitle}`}
                width={1000}
                height={1000}
                priority
                sizes="(max-width: 768px) 90vw, 28rem"
                className="w-full h-auto object-contain shadow-2xl"
              />
            )}
            <Dialog.Close
              className="absolute -top-3 -right-3 bg-background text-foreground rounded-full p-2 shadow-lg hover:bg-muted transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}
