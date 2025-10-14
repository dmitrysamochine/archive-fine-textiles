import { createClient } from "@sanity/client"

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_API_TOKEN!,
  apiVersion: "2024-01-01",
  useCdn: false,
})

async function cleanupImageField() {
  console.log('Starting cleanup of old "image" field...')

  // Fetch all fabricItems that have the old "image" field
  const items = await client.fetch(`*[_type == "fabricItem" && defined(image)]{ _id, itemNumber }`)

  console.log(`Found ${items.length} items with old "image" field`)

  let updated = 0
  let failed = 0

  for (const item of items) {
    try {
      // Unset the old "image" field
      await client.patch(item._id).unset(["image"]).commit()
      console.log(`✓ Cleaned up ${item.itemNumber}`)
      updated++
    } catch (error) {
      console.error(`✗ Failed to clean up ${item.itemNumber}:`, error)
      failed++
    }
  }

  console.log("\n=== Cleanup Complete ===")
  console.log(`Updated: ${updated}`)
  console.log(`Failed: ${failed}`)
}

cleanupImageField()
