import { createClient } from "@sanity/client"
import { createReadStream } from "fs"
import { readdir } from "fs/promises"
import { join, parse } from "path"

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_TOKEN

if (!projectId || !dataset || !token) {
  console.error("Error: Missing required environment variables")
  console.error("Make sure these are set in your environment:")
  console.error("  - NEXT_PUBLIC_SANITY_PROJECT_ID")
  console.error("  - NEXT_PUBLIC_SANITY_DATASET")
  console.error("  - SANITY_API_TOKEN")
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-01-01",
  useCdn: false,
})

// Update this path to where your images are stored
const IMAGES_FOLDER = "./fabric-images"

async function uploadImagesToSanity() {
  console.log("Starting image upload process...\n")

  try {
    // Read all files from the images folder
    const files = await readdir(IMAGES_FOLDER)
    const imageFiles = files.filter((file) => file.toLowerCase().endsWith(".jpg"))

    console.log(`Found ${imageFiles.length} images to upload\n`)

    let successCount = 0
    let errorCount = 0
    let notFoundCount = 0

    for (const filename of imageFiles) {
      // Extract itemNumber from filename (e.g., "806021-01.jpg" -> "806021-01")
      const { name: itemNumber } = parse(filename)

      try {
        console.log(`Processing ${filename} (itemNumber: ${itemNumber})...`)

        // Check if fabric item exists
        const fabricItem = await client.fetch(`*[_type == "fabricItem" && itemNumber == $itemNumber][0]`, {
          itemNumber,
        })

        if (!fabricItem) {
          console.log(`  ⚠️  No fabric item found for ${itemNumber}`)
          notFoundCount++
          continue
        }

        // Upload image to Sanity
        const imagePath = join(IMAGES_FOLDER, filename)
        const imageAsset = await client.assets.upload("image", createReadStream(imagePath), {
          filename: filename,
        })

        console.log(`  ✓ Uploaded image asset: ${imageAsset._id}`)

        // Update fabric item with image reference
        await client
          .patch(fabricItem._id)
          .setIfMissing({ images: [] })
          .append("images", [
            {
              _type: "image",
              _key: imageAsset._id,
              asset: {
                _type: "reference",
                _ref: imageAsset._id,
              },
            },
          ])
          .commit()

        console.log(`  ✓ Associated image with fabric item ${itemNumber}\n`)
        successCount++
      } catch (error) {
        console.error(`  ✗ Error processing ${filename}:`, error)
        errorCount++
      }
    }

    console.log("\n=== Upload Summary ===")
    console.log(`✓ Successfully uploaded: ${successCount}`)
    console.log(`⚠️  Fabric items not found: ${notFoundCount}`)
    console.log(`✗ Errors: ${errorCount}`)
    console.log(`Total processed: ${imageFiles.length}`)
  } catch (error) {
    console.error("Fatal error:", error)
    process.exit(1)
  }
}

uploadImagesToSanity()
