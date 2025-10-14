import { createClient } from "@sanity/client"
import { readdir, readFile } from "fs/promises"
import { join, extname, basename } from "path"

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_API_TOKEN!,
  apiVersion: "2024-01-01",
  useCdn: false,
})

async function uploadFabricImages() {
  console.log("🖼️  Starting fabric image upload...\n")

  // Path to your local images folder
  const imagesFolder = "./fabric-images"

  try {
    // Read all files from the folder
    const files = await readdir(imagesFolder)
    const imageFiles = files.filter((file) => extname(file).toLowerCase() === ".jpg")

    console.log(`📁 Found ${imageFiles.length} JPG images\n`)

    let successCount = 0
    let errorCount = 0
    let notFoundCount = 0

    for (const filename of imageFiles) {
      // Extract itemNumber from filename (e.g., "806021-01.jpg" → "806021-01")
      const itemNumber = basename(filename, extname(filename))

      try {
        // Check if fabric item exists
        const fabricItem = await client.fetch(`*[_type == "fabricItem" && itemNumber == $itemNumber][0]`, {
          itemNumber,
        })

        if (!fabricItem) {
          console.log(`⚠️  No fabric found for ${itemNumber} - skipping`)
          notFoundCount++
          continue
        }

        // Read image file
        const imagePath = join(imagesFolder, filename)
        const imageBuffer = await readFile(imagePath)

        // Upload image to Sanity
        console.log(`⬆️  Uploading ${filename}...`)
        const imageAsset = await client.assets.upload("image", imageBuffer, {
          filename: filename,
          contentType: "image/jpeg",
        })

        // Update fabric item with image reference
        await client
          .patch(fabricItem._id)
          .set({
            image: {
              _type: "image",
              asset: {
                _type: "reference",
                _ref: imageAsset._id,
              },
            },
          })
          .commit()

        console.log(`✅ Successfully uploaded and linked ${itemNumber}\n`)
        successCount++
      } catch (error) {
        console.error(`❌ Error processing ${filename}:`, error)
        errorCount++
      }
    }

    console.log("\n📊 Upload Summary:")
    console.log(`✅ Successfully uploaded: ${successCount}`)
    console.log(`⚠️  Fabric not found: ${notFoundCount}`)
    console.log(`❌ Errors: ${errorCount}`)
    console.log(`📁 Total processed: ${imageFiles.length}`)
  } catch (error) {
    console.error("❌ Fatal error:", error)
    process.exit(1)
  }
}

uploadFabricImages()
