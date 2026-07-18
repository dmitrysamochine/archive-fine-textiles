import { createClient } from "next-sanity"

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production"

if (!projectId) {
  // Surface a clear, actionable message instead of a cryptic
  // "Configuration must contain `projectId`" crash at import time.
  console.warn(
    "[v0] Missing NEXT_PUBLIC_SANITY_PROJECT_ID. Set it (and NEXT_PUBLIC_SANITY_DATASET) in your project environment variables so the Sanity client can connect.",
  )
}

const baseClient = createClient({
  // Fall back to a placeholder so createClient does not throw during module
  // initialization when the env var is missing. Requests will still require a
  // real projectId to return data.
  projectId: projectId || "placeholder",
  dataset,
  apiVersion: "2024-01-01",
  useCdn: true,
})

// Wrap `fetch` so that a missing/invalid Sanity configuration or an unreachable
// API degrades gracefully (empty results) instead of throwing an unhandled
// runtime error that breaks the page.
const originalFetch = baseClient.fetch.bind(baseClient)

baseClient.fetch = (async (...args: Parameters<typeof originalFetch>) => {
  if (!projectId) {
    // No real project configured yet — skip the network call entirely.
    return [] as never
  }

  try {
    return await originalFetch(...args)
  } catch (error) {
    console.error("[v0] Sanity fetch failed:", error)
    return [] as never
  }
}) as typeof baseClient.fetch

export const client = baseClient
