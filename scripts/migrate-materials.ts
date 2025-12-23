import { createClient } from "@sanity/client"

// Environment variables must be set before running this script
// Run with: NEXT_PUBLIC_SANITY_PROJECT_ID=your_id NEXT_PUBLIC_SANITY_DATASET=production SANITY_API_TOKEN=your_token npx tsx scripts/migrate-materials.ts
// Or add them to your shell environment first

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  token: process.env.SANITY_API_TOKEN!,
  apiVersion: "2024-01-01",
  useCdn: false,
})

// Material name patterns to match in content strings
const materialPatterns = [
  "solution dyed acrylic",
  "ramie",
  "silk",
  "polyamide",
  "polyester",
  "mohair",
  "merino lambswool",
  "viscose",
  "acrylic",
  "wool",
  "cotton",
  "linen",
]

function extractMaterials(contentString: string): string[] {
  if (!contentString) return []

  const lowerContent = contentString.toLowerCase()
  const foundMaterials: string[] = []

  // Check each material pattern
  for (const material of materialPatterns) {
    if (lowerContent.includes(material)) {
      foundMaterials.push(material)
    }
  }

  return foundMaterials
}

async function migrateMaterials() {
  console.log("Starting material migration...")

  try {
    // Fetch all materials
    const materials = await client.fetch(`*[_type == "material"] {_id, name, "slug": slug.current}`)
    console.log(`Found ${materials.length} material types`)

    // Create a lookup map
    const materialMap = new Map<string, string>()
    materials.forEach((m: any) => {
      materialMap.set(m.name.toLowerCase(), m._id)
    })

    // Fetch all fabric items
    const fabricItems = await client.fetch(`*[_type == "fabricItem"] {_id, itemNumber, content}`)
    console.log(`Found ${fabricItems.length} fabric items to process`)

    let updatedCount = 0
    let skippedCount = 0

    // Process each fabric item
    for (const item of fabricItems) {
      const materialNames = extractMaterials(item.content || "")

      if (materialNames.length === 0) {
        console.log(`⚠️ No materials found for ${item.itemNumber}`)
        skippedCount++
        continue
      }

      // Convert material names to references
      const materialRefs = materialNames
        .map((name) => {
          const materialId = materialMap.get(name)
          if (!materialId) {
            console.log(`⚠️ Material not found: ${name}`)
            return null
          }
          return {
            _type: "reference",
            _ref: materialId,
            _key: `material-${materialId}`,
          }
        })
        .filter(Boolean)

      if (materialRefs.length > 0) {
        // Update the fabric item
        await client.patch(item._id).set({ materials: materialRefs }).commit()

        console.log(`✅ Updated ${item.itemNumber} with materials: ${materialNames.join(", ")}`)
        updatedCount++
      }
    }

    console.log("\n" + "=".repeat(50))
    console.log(`✅ Migration complete!`)
    console.log(`   Updated: ${updatedCount} items`)
    console.log(`   Skipped: ${skippedCount} items`)
    console.log("=".repeat(50))
  } catch (error) {
    console.error("❌ Error during migration:", error)
    throw error
  }
}

// Run the migration
migrateMaterials()
  .then(() => {
    console.log("✅ Material migration complete!")
    process.exit(0)
  })
  .catch((error) => {
    console.error("❌ Migration failed:", error)
    process.exit(1)
  })
