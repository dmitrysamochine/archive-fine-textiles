import { defineType, defineField, defineArrayMember } from "sanity"

// Fabric Item - Main content type
export const fabricItem = defineType({
  name: "fabricItem",
  title: "Fabric Items",
  type: "document",
  fields: [
    defineField({
      name: "itemNumber",
      title: "Item Number",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "Unique SKU (e.g., 803003-05)",
    }),
    defineField({
      name: "fabric",
      title: "Fabric Collection",
      type: "reference",
      to: [{ type: "fabricCollection" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "colorway",
      title: "Colorway",
      type: "reference",
      to: [{ type: "colorway" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Wing", value: "wing" },
          { title: "Flat", value: "flat" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "yardage",
      title: "Yardage",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
      description: "Available quantity in yards",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "In Stock", value: "in-stock" },
          { title: "Low Stock", value: "low-stock" },
          { title: "Out of Stock", value: "out-of-stock" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "notes",
      title: "Notes",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "content",
      title: "Material Content",
      type: "string",
      description: "Material composition (e.g., 100% Wool)",
    }),
    defineField({
      name: "width",
      title: "Width",
      type: "string",
      description: 'Fabric width (e.g., 59")',
    }),
    defineField({
      name: "repeat",
      title: "Pattern Repeat",
      type: "string",
      description: 'Pattern repeat dimensions (e.g., H-9" V-15")',
    }),
    defineField({
      name: "description",
      title: "Description Categories",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "category" }],
        }),
      ],
    }),
    defineField({
      name: "color",
      title: "Colors",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "color" }],
        }),
      ],
    }),
    defineField({
      name: "materials",
      title: "Materials",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "material" }],
        }),
      ],
      description: "Select material types (for filtering). Material Content field remains for display.",
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alternative text",
              description: "Important for SEO and accessibility",
            },
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "itemNumber",
      fabric: "fabric.name",
      colorway: "colorway.name",
      media: "images.0",
    },
    prepare({ title, fabric, colorway, media }) {
      return {
        title: `${title} - ${fabric}`,
        subtitle: colorway,
        media,
      }
    },
  },
})

// Fabric Collection
export const fabricCollection = defineType({
  name: "fabricCollection",
  title: "Fabric Collections",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "featuredImage",
      title: "Featured Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
  ],
})

// Colorway
export const colorway = defineType({
  name: "colorway",
  title: "Colorways",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
    }),
  ],
})

// Category
export const category = defineType({
  name: "category",
  title: "Categories",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
})

// Color
export const color = defineType({
  name: "color",
  title: "Colors",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "hexValue",
      title: "Hex Color Value",
      type: "string",
      description: "Optional hex code for UI display (e.g., #FF5733)",
    }),
  ],
  preview: {
    select: {
      title: "name",
      hex: "hexValue",
    },
    prepare({ title, hex }) {
      return {
        title,
        subtitle: hex || "No color specified",
      }
    },
  },
})

// Material
export const material = defineType({
  name: "material",
  title: "Materials",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "name",
    },
  },
})

// Contact Page
export const contactPage = defineType({
  name: "contactPage",
  title: "Contact Page",
  type: "document",
  fields: [
    defineField({
      name: "images",
      title: "Slideshow Images",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alternative text",
              description: "Important for SEO and accessibility",
            },
          ],
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Contact Page",
      }
    },
  },
})

// Open Stock Item
export const openStockItem = defineType({
  name: "openStockItem",
  title: "Open Stock Items",
  type: "document",
  fields: [
    defineField({
      name: "itemNumber",
      title: "Item Number",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "Unique SKU (e.g., OS-001)",
    }),
    defineField({
      name: "fabric",
      title: "Fabric",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "Fabric name (e.g., Brushed Cotton, Linen)",
    }),
    defineField({
      name: "colorway",
      title: "Colorway",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "Colorway name (e.g., Grey, Pale Blue)",
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "content",
      title: "Material Content",
      type: "string",
      description: "Material composition for display (e.g., 100% Cotton)",
    }),
    defineField({
      name: "width",
      title: "Width",
      type: "string",
      description: 'Fabric width (e.g., 55")',
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "string",
      description: "Brief description (e.g., Solid, Textured)",
    }),
    defineField({
      name: "colors",
      title: "Colors",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "color" }],
        }),
      ],
      description: "Select colors for filtering",
    }),
    defineField({
      name: "materials",
      title: "Materials",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "material" }],
        }),
      ],
      description: "Select materials for filtering",
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alternative text",
              description: "Important for SEO and accessibility",
            },
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "itemNumber",
      fabric: "fabric",
      colorway: "colorway",
      media: "images.0",
    },
    prepare({ title, fabric, colorway, media }) {
      return {
        title: `${title} - ${fabric}`,
        subtitle: colorway,
        media,
      }
    },
  },
})

export const schemaTypes = [
  fabricItem,
  fabricCollection,
  colorway,
  category,
  color,
  material,
  contactPage,
  openStockItem,
]
