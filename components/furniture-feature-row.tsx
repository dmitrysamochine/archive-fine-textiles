import Link from "next/link"
import { FurnitureImage } from "@/components/furniture-image"
import { formatPrice } from "@/lib/shop"
import type { FurnitureItem } from "@/sanity/types"

interface FurnitureFeatureRowProps {
  item: FurnitureItem
  index: number
}

export function FurnitureFeatureRow({ item, index }: FurnitureFeatureRowProps) {
  const isReversed = index % 2 === 1
  const isSold = item.available === false
  const firstImage = item.images?.[0]
  const href = `/shop/furniture/${item.slug.current}`

  return (
    <article className="border-t border-border py-12 md:py-20 first:border-t-0">
      <div
        className={`flex flex-col gap-8 md:gap-12 lg:gap-16 md:items-center ${
          isReversed ? "md:flex-row-reverse" : "md:flex-row"
        }`}
      >
        {/* Image */}
        <div className="w-full md:w-3/5">
          <Link href={href} className="group block relative overflow-hidden bg-muted">
            <FurnitureImage
              image={firstImage}
              alt={firstImage?.alt || `${item.title} by ${item.maker}`}
              width={1400}
              height={1050}
              sizes="(max-width: 768px) 100vw, 60vw"
              priority={index === 0}
              className="w-full h-auto object-cover aspect-[4/3] transition-transform duration-500 group-hover:scale-[1.03]"
            />
            {isSold && (
              <span className="absolute top-4 left-4 bg-foreground text-background text-xs font-sans uppercase tracking-widest px-3 py-1.5">
                Sold
              </span>
            )}
          </Link>
        </div>

        {/* Details */}
        <div className="w-full md:w-2/5">
          <div className="max-w-md space-y-6">
            <div className="space-y-2">
              {item.era && (
                <p className="text-xs font-sans uppercase tracking-[0.2em] text-muted-foreground">{item.era}</p>
              )}
              <h2 className="text-3xl md:text-4xl font-heading leading-tight text-balance">
                <Link href={href} className="hover:text-accent transition-colors">
                  {item.title}
                </Link>
              </h2>
              <p className="text-base font-sans text-muted-foreground">{item.maker}</p>
            </div>

            <dl className="space-y-3 text-sm font-sans border-t border-border pt-6">
              {item.materialContent && (
                <div className="flex flex-col gap-0.5">
                  <dt className="text-muted-foreground uppercase tracking-wider text-xs">Materials</dt>
                  <dd>{item.materialContent}</dd>
                </div>
              )}
              {item.dimensions && (
                <div className="flex flex-col gap-0.5">
                  <dt className="text-muted-foreground uppercase tracking-wider text-xs">Dimensions</dt>
                  <dd>{item.dimensions}</dd>
                </div>
              )}
            </dl>

            <div className="flex items-center justify-between border-t border-border pt-6">
              <p className="text-xl font-heading">{formatPrice(item.price)}</p>
              <Link
                href={href}
                className="text-sm font-sans uppercase tracking-widest underline underline-offset-4 hover:text-accent transition-colors"
              >
                {isSold ? "View Details" : "Inquire"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
