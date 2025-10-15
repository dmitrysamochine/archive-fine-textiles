import type { Metadata } from "next"
import localFont from "next/font/local"
import { Analytics } from "@vercel/analytics/next"
import type React from "react"
import { Suspense } from "react"
import { SiteHeader } from "@/components/site-header"
import "./globals.css"

const bernhard = localFont({
  src: "../public/fonts/BernhardModernBT.ttf",
  variable: "--font-bernhard",
  display: "swap",
})

const lato = localFont({
  src: "../public/fonts/Lato-Light.ttf",
  variable: "--font-lato",
  display: "swap",
  weight: "300",
})

export const metadata: Metadata = {
  title: "Archive Fine Textiles",
  description: "Curated collection of fine textiles and fabrics",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${bernhard.variable} ${lato.variable} font-sans`}>
        <SiteHeader />
        <Suspense fallback={null}>
          {children}
          <Analytics />
        </Suspense>
      </body>
    </html>
  )
}
