import { defineConfig } from "sanity"
import { structureTool } from "sanity/structure"
import { visionTool } from "@sanity/vision"
import { schemaTypes } from "./sanity/schema"

export default defineConfig({
  name: "default",
  title: "Archive Fine Textiles",

  projectId: "0piql2nt",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",

  plugins: [
    structureTool({
      defaultDocumentNode: (S) => S.document(),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
