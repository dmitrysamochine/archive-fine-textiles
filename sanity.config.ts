import { defineConfig } from "sanity"
import { structureTool } from "sanity/structure"
import { visionTool } from "@sanity/vision"
import { schemaTypes } from "./sanity/schema"

export default defineConfig({
  name: "default",
  title: "Archive Fine Textiles",

  basePath: "/studio",

  projectId: "0piql2nt",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Site Settings")
              .id("siteSettings")
              .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
            S.listItem()
              .title("Shop Settings")
              .id("shopSettings")
              .child(S.document().schemaType("shopSettings").documentId("shopSettings")),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (listItem) => !["shopSettings", "siteSettings"].includes(listItem.getId() as string),
            ),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
