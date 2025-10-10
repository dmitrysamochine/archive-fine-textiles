/**
 * Delete All Documents Script
 *
 * This script deletes all documents from your Sanity dataset.
 * Use this to clear data before re-importing.
 *
 * Usage:
 * Run this script from the v0 interface to delete all documents
 */

import { config } from "dotenv"
import { resolve } from "path"

config({ path: resolve(process.cwd(), ".env.local") })

import { createClient } from "@sanity/client"

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production"
const token = process.env.SANITY_API_TOKEN

if (!projectId || !token) {
  console.error("❌ Error: Missing required environment variables")
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
})

async function deleteAllDocuments() {
  console.log("[v0] Starting deletion of all documents...")

  // Get all document types
  const types = ["fabricItem", "fabricCollection", "colorway", "category", "color"]

  for (const type of types) {
    console.log(`[v0] Deleting all ${type} documents...`)

    // Query for all documents of this type
    const query = `*[_type == $type]._id`
    const ids = await client.fetch(query, { type })

    console.log(`[v0] Found ${ids.length} ${type} documents`)

    // Delete in batches
    for (const id of ids) {
      try {
        await client.delete(id)
        console.log(`[v0] Deleted ${type}: ${id}`)
      } catch (error) {
        console.error(`[v0] Error deleting ${id}:`, error)
      }
    }
  }

  console.log("[v0] ✅ All documents deleted successfully!")
}

deleteAllDocuments().catch(console.error)
