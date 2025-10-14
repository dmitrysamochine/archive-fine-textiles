import Image from "next/image"
import { urlForImage } from "@/sanity/lib/image"
import type { SanityImageSource } from "@sanity/image-url/lib/types/types"

interface SanityImageProps {
  image: SanityImageSource
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
}

export function SanityImage({ image, alt, width = 800, height = 600, className, priority = false }: SanityImageProps) {
  const imageUrl = urlForImage(image).width(width).height(height).url()

  return (
    <Image
      src={imageUrl || "/placeholder.svg"}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      loading={priority ? undefined : "lazy"}
    />
  )
}
