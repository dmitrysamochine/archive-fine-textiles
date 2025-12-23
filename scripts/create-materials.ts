import { createClient } from "@sanity/client"

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  token: process.env.SANITY_API_TOKEN!,
  apiVersion: "2024-01-01",
  useCdn: false,
})

// Common material types found in fabric content
const materials = [
  "Cotton",
  "Linen",
  "Silk",
  "Wool",
  "Polyester",
  "Viscose",
  "Rayon",
  "Cashmere",
  "Mohair",
  "Acrylic",
  "Nylon",
  "Spandex",
  "Elastane",
  "Hemp",
  "Bamboo",
  "Tencel",
  "Modal",
  "Acetate",
  "Velvet",
  "Chenille",
]

async function createMaterials() {
  console.log("Creating material documents in Sanity...")

  try {
    const materialDocs = materials.map((name) => ({
      _type: "material",
      name,
      slug: {
        _type: "slug",
        current: name.toLowerCase().replace(/\s+/g, "-"),
      },
    }))

    const result = await client.create(materialDocs as any)
    console.log(`✅ Created ${materials.length} material documents`)
    return result
  } catch (error: any) {
    if (error.message.includes("already exists")) {
      console.log("⚠️ Materials already exist, fetching existing materials...")
      const existingMaterials = await client.fetch(`*[_type == "material"] {_id, name, slug}`)
      console.log(`Found ${existingMaterials.length} existing materials`)
      return existingMaterials
    }
    throw error
  }
}

// Run the script
createMaterials()
  .then(() => {
    console.log("✅ Material creation complete!")
    process.exit(0)
  })
  .catch((error) => {
    console.error("❌ Error creating materials:", error)
    process.exit(1)
  })
