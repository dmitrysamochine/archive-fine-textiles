"use client"

import dynamic from "next/dynamic"

// Load the Studio client-only. The `sanity` package pulls in Node-only
// dependencies (jsdom via isomorphic-dompurify) that must never be evaluated
// during server-side rendering, so we disable SSR for this admin route.
const StudioClient = dynamic(() => import("./StudioClient"), { ssr: false })

export default function Studio() {
  return <StudioClient />
}
