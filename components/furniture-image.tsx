import Image from "next/image"
import { urlForImage } from "@/sanity/lib/image"
import type { FurnitureItem } from "@/sanity/types"

type FurnitureImageAsset = NonNullable<FurnitureItem["images"]>[number]

interface FurnitureImageProps {
  image?: FurnitureImageAsset
  alt: string
  width?: number
  height?: number
  className?: string
  sizes?: string
  priority?: boolean
}

/**
 * Renders a furniture image from Sanity, falling back to a placeholder when no
 * image has been uploaded yet. Unlike SanityImage, this safely handles the
 * undefined-image case (furniture photography is arriving after launch).
 */
export function FurnitureImage({
  image,
  alt,
  width = 1200,
  height = 900,
  className,
  sizes,
  priority = false,
}: FurnitureImageProps) {
  const src = image?.asset
    ? urlForImage(image).width(width).height(height).url()
    : `/placeholder.svg?height=${height}&width=${width}&query=vintage%20designer%20furniture`

  return (
    <Image
      src={src || "/placeholder.svg"}
      alt={alt}
      width={width}
      height={height}
      className={className}
      sizes={sizes}
      priority={priority}
      loading={priority ? undefined : "lazy"}
    />
  )
}
