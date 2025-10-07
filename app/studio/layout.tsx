import type React from "react"
export const metadata = {
  title: "Sanity Studio - Archive Fine Textiles",
}

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  )
}
