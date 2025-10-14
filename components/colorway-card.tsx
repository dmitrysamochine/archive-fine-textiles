import Link from "next/link"
import type { Colorway } from "@/sanity/types"

interface ColorwayCardProps {
  colorway: Colorway
}

export function ColorwayCard({ colorway }: ColorwayCardProps) {
  return (
    <Link href={`/colorways/${colorway.slug.current}`} className="block group">
      <article className="p-6 border rounded-lg transition-colors hover:bg-muted">
        <div className="space-y-2">
          <h3 className="font-medium text-lg">{colorway.name}</h3>
          {colorway.description && <p className="text-sm text-muted-foreground line-clamp-2">{colorway.description}</p>}
          {colorway.itemCount !== undefined && (
            <p className="text-sm text-muted-foreground">{colorway.itemCount} items</p>
          )}
        </div>
      </article>
    </Link>
  )
}
