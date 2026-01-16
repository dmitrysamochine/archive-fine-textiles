/**
 * Migration script to create Open Stock items in Sanity
 *
 * Run with:
 * NEXT_PUBLIC_SANITY_PROJECT_ID=xxx NEXT_PUBLIC_SANITY_DATASET=production SANITY_API_TOKEN=xxx npx tsx scripts/create-open-stock.ts
 */

import { createClient } from "@sanity/client"

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production"
const token = process.env.SANITY_API_TOKEN

if (!projectId || !token) {
  console.error("Missing environment variables. Please set:")
  console.error("  NEXT_PUBLIC_SANITY_PROJECT_ID")
  console.error("  NEXT_PUBLIC_SANITY_DATASET (optional, defaults to production)")
  console.error("  SANITY_API_TOKEN")
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-01-01",
  useCdn: false,
})

// Open Stock data from CSV
const openStockData = [
  {
    itemNumber: "7060-01",
    fabric: "Brushed Cotton",
    colorway: "Grey",
    price: 55,
    content: "100% Cotton",
    width: '55"',
    description: "Solid",
    color: "Grey",
  },
  {
    itemNumber: "7060-02",
    fabric: "Brushed Cotton",
    colorway: "Pale Blue",
    price: 55,
    content: "100% Cotton",
    width: '55"',
    description: "Solid",
    color: "Blue",
  },
  {
    itemNumber: "7062-02",
    fabric: "Brushed Cotton",
    colorway: "Brown",
    price: 55,
    content: "100% Cotton",
    width: '55"',
    description: "Solid",
    color: "Brown",
  },
  {
    itemNumber: "7062-03",
    fabric: "Brushed Cotton",
    colorway: "Charcoal",
    price: 55,
    content: "100% Cotton",
    width: '55"',
    description: "Solid",
    color: "Charcoal",
  },
  {
    itemNumber: "7062-04",
    fabric: "Brushed Cotton",
    colorway: "Rose",
    price: 55,
    content: "100% Cotton",
    width: '55"',
    description: "Solid",
    color: "Rose",
  },
  {
    itemNumber: "7002-02",
    fabric: "Linen",
    colorway: "Natural",
    price: 65,
    content: "100% Linen",
    width: '59"',
    description: "Solid",
    color: "Natural",
  },
  {
    itemNumber: "7002-04",
    fabric: "Linen",
    colorway: "Green",
    price: 65,
    content: "100% Linen",
    width: '59"',
    description: "Solid",
    color: "Green",
  },
  {
    itemNumber: "7002-05",
    fabric: "Linen",
    colorway: "Oatmeal",
    price: 65,
    content: "100% Linen",
    width: '59"',
    description: "Solid",
    color: "Oatmeal",
  },
  {
    itemNumber: "7002-06",
    fabric: "Linen",
    colorway: "Cream",
    price: 65,
    content: "100% Linen",
    width: '59"',
    description: "Solid",
    color: "Cream",
  },
  {
    itemNumber: "7001-01",
    fabric: "Cotton Linen",
    colorway: "Rust",
    price: 60,
    content: "63% Cotton 37% Linen",
    width: '55"',
    description: "Solid",
    color: "Rust",
  },
  {
    itemNumber: "7001-02",
    fabric: "Cotton Linen",
    colorway: "Burgundy",
    price: 60,
    content: "63% Cotton 37% Linen",
    width: '55"',
    description: "Solid",
    color: "Burgundy",
  },
  {
    itemNumber: "7001-03",
    fabric: "Cotton Linen",
    colorway: "Blue",
    price: 60,
    content: "63% Cotton 37% Linen",
    width: '55"',
    description: "Solid",
    color: "Blue",
  },
  {
    itemNumber: "7001-04",
    fabric: "Cotton Linen",
    colorway: "Green",
    price: 60,
    content: "63% Cotton 37% Linen",
    width: '55"',
    description: "Solid",
    color: "Green",
  },
  {
    itemNumber: "7001-05",
    fabric: "Cotton Linen",
    colorway: "Taupe",
    price: 60,
    content: "63% Cotton 37% Linen",
    width: '55"',
    description: "Solid",
    color: "Taupe",
  },
  {
    itemNumber: "7001-06",
    fabric: "Cotton Linen",
    colorway: "Brown",
    price: 60,
    content: "63% Cotton 37% Linen",
    width: '55"',
    description: "Solid",
    color: "Brown",
  },
  {
    itemNumber: "7001-07",
    fabric: "Cotton Linen",
    colorway: "Grey",
    price: 60,
    content: "63% Cotton 37% Linen",
    width: '55"',
    description: "Solid",
    color: "Grey",
  },
  {
    itemNumber: "7001-08",
    fabric: "Cotton Linen",
    colorway: "Navy",
    price: 60,
    content: "63% Cotton 37% Linen",
    width: '55"',
    description: "Solid",
    color: "Navy",
  },
  {
    itemNumber: "7001-09",
    fabric: "Cotton Linen",
    colorway: "Cream",
    price: 60,
    content: "63% Cotton 37% Linen",
    width: '55"',
    description: "Solid",
    color: "Cream",
  },
  {
    itemNumber: "7001-10",
    fabric: "Cotton Linen",
    colorway: "Charcoal",
    price: 60,
    content: "63% Cotton 37% Linen",
    width: '55"',
    description: "Solid",
    color: "Charcoal",
  },
  {
    itemNumber: "7001-11",
    fabric: "Cotton Linen",
    colorway: "Mustard",
    price: 60,
    content: "63% Cotton 37% Linen",
    width: '55"',
    description: "Solid",
    color: "Mustard",
  },
  {
    itemNumber: "7001-12",
    fabric: "Cotton Linen",
    colorway: "Straw",
    price: 60,
    content: "63% Cotton 37% Linen",
    width: '55"',
    description: "Solid",
    color: "Straw",
  },
  {
    itemNumber: "7001-13",
    fabric: "Cotton Linen",
    colorway: "Natural",
    price: 60,
    content: "63% Cotton 37% Linen",
    width: '55"',
    description: "Solid",
    color: "Natural",
  },
  {
    itemNumber: "7001-14",
    fabric: "Cotton Linen",
    colorway: "Rose",
    price: 60,
    content: "63% Cotton 37% Linen",
    width: '55"',
    description: "Solid",
    color: "Rose",
  },
  {
    itemNumber: "7001-15",
    fabric: "Cotton Linen",
    colorway: "Sage",
    price: 60,
    content: "63% Cotton 37% Linen",
    width: '55"',
    description: "Solid",
    color: "Sage",
  },
  {
    itemNumber: "7001-16",
    fabric: "Cotton Linen",
    colorway: "Sea Green",
    price: 60,
    content: "63% Cotton 37% Linen",
    width: '55"',
    description: "Solid",
    color: "Green",
  },
  {
    itemNumber: "7001-17",
    fabric: "Cotton Linen",
    colorway: "Wine",
    price: 60,
    content: "63% Cotton 37% Linen",
    width: '55"',
    description: "Solid",
    color: "Wine",
  },
  {
    itemNumber: "7005-01",
    fabric: "Wool",
    colorway: "Tan",
    price: 125,
    content: "100% Wool",
    width: '59"',
    description: "Textured",
    color: "Tan",
  },
  {
    itemNumber: "7005-02",
    fabric: "Wool",
    colorway: "Brown",
    price: 125,
    content: "100% Wool",
    width: '59"',
    description: "Textured",
    color: "Brown",
  },
  {
    itemNumber: "7005-03",
    fabric: "Wool",
    colorway: "Grey",
    price: 125,
    content: "100% Wool",
    width: '59"',
    description: "Textured",
    color: "Grey",
  },
  {
    itemNumber: "7005-04",
    fabric: "Wool",
    colorway: "White",
    price: 125,
    content: "100% Wool",
    width: '59"',
    description: "Textured",
    color: "White",
  },
  {
    itemNumber: "7006-01",
    fabric: "Wool Blend",
    colorway: "Oatmeal",
    price: 110,
    content: "80% Wool 20% Linen",
    width: '59"',
    description: "Textured",
    color: "Oatmeal",
  },
  {
    itemNumber: "7006-02",
    fabric: "Wool Blend",
    colorway: "Sky Blue",
    price: 110,
    content: "80% Wool 20% Linen",
    width: '59"',
    description: "Textured",
    color: "Blue",
  },
  {
    itemNumber: "7006-03",
    fabric: "Wool Blend",
    colorway: "Pink",
    price: 110,
    content: "80% Wool 20% Linen",
    width: '59"',
    description: "Textured",
    color: "Rose",
  },
  {
    itemNumber: "7006-04",
    fabric: "Wool Blend",
    colorway: "Cream",
    price: 110,
    content: "80% Wool 20% Linen",
    width: '59"',
    description: "Textured",
    color: "Cream",
  },
  {
    itemNumber: "7006-05",
    fabric: "Wool Blend",
    colorway: "Navy",
    price: 110,
    content: "80% Wool 20% Linen",
    width: '59"',
    description: "Textured",
    color: "Navy",
  },
  {
    itemNumber: "7006-06",
    fabric: "Wool Blend",
    colorway: "Brown",
    price: 110,
    content: "80% Wool 20% Linen",
    width: '59"',
    description: "Textured",
    color: "Brown",
  },
  {
    itemNumber: "7006-07",
    fabric: "Wool Blend",
    colorway: "Grey",
    price: 110,
    content: "80% Wool 20% Linen",
    width: '59"',
    description: "Textured",
    color: "Grey",
  },
  {
    itemNumber: "7006-08",
    fabric: "Wool Blend",
    colorway: "White",
    price: 110,
    content: "80% Wool 20% Linen",
    width: '59"',
    description: "Textured",
    color: "White",
  },
  {
    itemNumber: "7006-09",
    fabric: "Wool Blend",
    colorway: "Charcoal",
    price: 110,
    content: "80% Wool 20% Linen",
    width: '59"',
    description: "Textured",
    color: "Charcoal",
  },
]

// Material keywords to match
const materialKeywords = ["Cotton", "Linen", "Wool"]

async function run() {
  console.log("Fetching existing colors and materials from Sanity...")

  // Fetch existing colors and materials
  const [colors, materials] = await Promise.all([
    client.fetch(`*[_type == "color"] { _id, name, "slug": slug.current }`),
    client.fetch(`*[_type == "material"] { _id, name, "slug": slug.current }`),
  ])

  console.log(`Found ${colors.length} colors and ${materials.length} materials`)

  // Create lookup maps
  const colorMap = new Map<string, string>()
  colors.forEach((c: any) => {
    colorMap.set(c.name.toLowerCase(), c._id)
    colorMap.set(c.slug.toLowerCase(), c._id)
  })

  const materialMap = new Map<string, string>()
  materials.forEach((m: any) => {
    materialMap.set(m.name.toLowerCase(), m._id)
    materialMap.set(m.slug.toLowerCase(), m._id)
  })

  console.log(`\nProcessing ${openStockData.length} Open Stock items...`)

  let successCount = 0
  let errorCount = 0

  for (const item of openStockData) {
    try {
      // Find color references
      const colorRefs: Array<{ _type: "reference"; _ref: string; _key: string }> = []
      const colorNames = item.color.split("/").map((c) => c.trim().toLowerCase())

      for (const colorName of colorNames) {
        const colorId = colorMap.get(colorName)
        if (colorId) {
          colorRefs.push({
            _type: "reference",
            _ref: colorId,
            _key: `color-${colorId}`,
          })
        } else {
          console.warn(`  Warning: Color "${colorName}" not found for item ${item.itemNumber}`)
        }
      }

      // Find material references from content field
      const materialRefs: Array<{ _type: "reference"; _ref: string; _key: string }> = []
      const contentLower = item.content.toLowerCase()

      for (const keyword of materialKeywords) {
        if (contentLower.includes(keyword.toLowerCase())) {
          const materialId = materialMap.get(keyword.toLowerCase())
          if (materialId) {
            materialRefs.push({
              _type: "reference",
              _ref: materialId,
              _key: `material-${materialId}`,
            })
          }
        }
      }

      // Create the Open Stock item document
      const doc = {
        _type: "openStockItem",
        itemNumber: item.itemNumber,
        fabric: item.fabric,
        colorway: item.colorway,
        price: item.price,
        content: item.content,
        width: item.width,
        description: item.description,
        colors: colorRefs.length > 0 ? colorRefs : undefined,
        materials: materialRefs.length > 0 ? materialRefs : undefined,
      }

      await client.create(doc)
      console.log(`  Created: ${item.itemNumber} - ${item.fabric} (${item.colorway})`)
      successCount++
    } catch (error) {
      console.error(`  Error creating ${item.itemNumber}:`, error)
      errorCount++
    }
  }

  console.log(`\n--- Migration Complete ---`)
  console.log(`Successfully created: ${successCount}`)
  console.log(`Errors: ${errorCount}`)
}

run().catch(console.error)
