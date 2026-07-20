import type { Metadata, Viewport } from "next"
import Studio from "./Studio"

export const dynamic = "force-static"

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

export const metadata: Metadata = {
  robots: "noindex",
}

export default function StudioPage() {
  return <Studio />
}
