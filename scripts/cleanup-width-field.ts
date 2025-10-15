import { createClient } from "@sanity/client"

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_API_TOKEN!,
  apiVersion: "2024-01-01",
  useCdn: false,
})

async function cleanupWidthField() {
  console.log("Starting width field cleanup...")

  // Fetch all fabric items
  const fabricItems = await client.fetch<Array<{ _id: string; itemNumber: string; width?: string }>>(
    `*[_type == "fabricItem" && defined(width)]{ _id, itemNumber, width }`,
  )

  console.log(`Found ${fabricItems.length} fabric items with width field`)

  let updatedCount = 0
  let skippedCount = 0

  for (const item of fabricItems) {
    const originalWidth = item.width

    if (!originalWidth) {
      skippedCount++
      continue
    }

    // Pattern: "59" becomes 59"
    const cleanedWidth = originalWidth.replace(/^"/, "").replace(/"$/, '"')

    // Only update if the value changed
    if (cleanedWidth !== originalWidth) {
      await client.patch(item._id).set({ width: cleanedWidth }).commit()

      console.log(`Updated ${item.itemNumber}: "${originalWidth}" → "${cleanedWidth}"`)
      updatedCount++
    } else {
      skippedCount++
    }
  }

  console.log("\n✅ Width field cleanup completed!")
  console.log(`Updated: ${updatedCount}`)
  console.log(`Skipped (no changes needed): ${skippedCount}`)
}

cleanupWidthField().catch((error) => {
  console.error("Error cleaning up width field:", error)
  process.exit(1)
})
