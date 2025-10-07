import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

/** 
 * CSV to Sanity Import Script
 * ...rest of the file
/**
 * CSV to Sanity Import Script
 *
 * This script imports fabric data from your CSV into Sanity.
 *
 * Prerequisites:
 * 1. Set up .env.local with SANITY_API_TOKEN
 * 2. Ensure Sanity project is created and configured
 *
 * Usage:
 * Run this script from the v0 interface to import your CSV data
 */

import { createClient } from "@sanity/client"

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

interface CSVRow {
  Fabric: string
  Colorway: string
  "Item Number": string
  Type: string
  Price: string
  Yardage: string
  Status: string
  Notes?: string
  CONTENT?: string
  WIDTH?: string
  REPEAT?: string
  DESCRIPTON?: string
  COLOR?: string
  Photo?: string
}

async function importData() {
  console.log("[v0] Starting CSV import to Sanity...")

  // Fetch CSV data
  const csvUrl =
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ARCHIVE%20fine%20textiles%20Inventory%20-%20Sheet1-pMj5t1dyLZGzYonIGIo428LjIBoXwW.csv"

  console.log("[v0] Fetching CSV data...")
  const response = await fetch(csvUrl)
  const csvText = await response.text()

  // Parse CSV
  const lines = csvText.split("\n")
  const headers = lines[0].split(",").map((h) => h.trim())
  const rows: CSVRow[] = []

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue
    const values = lines[i].split(",").map((v) => v.trim())
    const row: any = {}
    headers.forEach((header, index) => {
      row[header] = values[index] || ""
    })
    rows.push(row)
  }

  console.log(`[v0] Parsed ${rows.length} fabric items from CSV`)

  // Extract unique values for relational data
  const uniqueFabrics = [...new Set(rows.map((r) => r.Fabric).filter(Boolean))]
  const uniqueColorways = [...new Set(rows.map((r) => r.Colorway).filter(Boolean))]
  const uniqueCategories = [
    ...new Set(rows.flatMap((r) => r.DESCRIPTON?.split("/").map((c) => c.trim()) || []).filter(Boolean)),
  ]
  const uniqueColors = [...new Set(rows.map((r) => r.COLOR).filter(Boolean))]

  console.log("[v0] Creating supporting documents...")
  console.log(`[v0] - ${uniqueFabrics.length} fabric collections`)
  console.log(`[v0] - ${uniqueColorways.length} colorways`)
  console.log(`[v0] - ${uniqueCategories.length} categories`)
  console.log(`[v0] - ${uniqueColors.length} colors`)

  // Create fabric collections
  const fabricMap = new Map()
  for (const fabricName of uniqueFabrics) {
    const doc = await client.create({
      _type: "fabricCollection",
      name: fabricName,
      slug: {
        _type: "slug",
        current: fabricName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      },
    })
    fabricMap.set(fabricName, doc._id)
    console.log(`[v0] Created fabric collection: ${fabricName}`)
  }

  // Create colorways
  const colorwayMap = new Map()
  for (const colorwayName of uniqueColorways) {
    const doc = await client.create({
      _type: "colorway",
      name: colorwayName,
      slug: {
        _type: "slug",
        current: colorwayName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      },
    })
    colorwayMap.set(colorwayName, doc._id)
    console.log(`[v0] Created colorway: ${colorwayName}`)
  }

  // Create categories
  const categoryMap = new Map()
  for (const categoryName of uniqueCategories) {
    const doc = await client.create({
      _type: "category",
      name: categoryName,
      slug: {
        _type: "slug",
        current: categoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      },
    })
    categoryMap.set(categoryName, doc._id)
    console.log(`[v0] Created category: ${categoryName}`)
  }

  // Create colors
  const colorMap = new Map()
  for (const colorName of uniqueColors) {
    const doc = await client.create({
      _type: "color",
      name: colorName,
      slug: {
        _type: "slug",
        current: colorName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      },
    })
    colorMap.set(colorName, doc._id)
    console.log(`[v0] Created color: ${colorName}`)
  }

  // Create fabric items
  console.log("[v0] Creating fabric items...")
  let successCount = 0

  for (const row of rows) {
    try {
      const categories =
        row.DESCRIPTON?.split("/")
          .map((c) => c.trim())
          .filter(Boolean) || []
      const colors = row.COLOR ? [row.COLOR] : []

      await client.create({
        _type: "fabricItem",
        itemNumber: row["Item Number"],
        fabric: {
          _type: "reference",
          _ref: fabricMap.get(row.Fabric),
        },
        colorway: {
          _type: "reference",
          _ref: colorwayMap.get(row.Colorway),
        },
        type: row.Type.toLowerCase() === "wing" ? "wing" : "flat",
        price: Number.parseFloat(row.Price.replace("$", "").replace(",", "")),
        yardage: Number.parseFloat(row.Yardage),
        status: row.Status.toLowerCase().includes("low") ? "low-stock" : "in-stock",
        notes: row.Notes || undefined,
        content: row.CONTENT || undefined,
        width: row.WIDTH || undefined,
        repeat: row.REPEAT || undefined,
        description: categories.map((cat) => ({
          _type: "reference",
          _ref: categoryMap.get(cat),
          _key: Math.random().toString(36).substr(2, 9),
        })),
        color: colors.map((col) => ({
          _type: "reference",
          _ref: colorMap.get(col),
          _key: Math.random().toString(36).substr(2, 9),
        })),
      })

      successCount++
      if (successCount % 10 === 0) {
        console.log(`[v0] Imported ${successCount}/${rows.length} items...`)
      }
    } catch (error) {
      console.error(`[v0] Error importing item ${row["Item Number"]}:`, error)
    }
  }

  console.log(`[v0] ✅ Import complete! Successfully imported ${successCount} fabric items.`)
  console.log("[v0] Next steps:")
  console.log("[v0] 1. Visit /studio to access Sanity Studio")
  console.log("[v0] 2. Add images to your fabric items")
  console.log("[v0] 3. Review and refine the imported data")
}

importData().catch(console.error)
