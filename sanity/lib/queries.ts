import { groq } from "next-sanity"

// Get all fabric items with filtering and sorting
export const fabricItemsQuery = groq`
  *[_type == "fabricItem" 
    && ($collection == null || references($collection))
    && ($colorway == null || colorway->slug.current == $colorway)
    && ($color == null || $color in color[]->slug.current)
    && ($material == null || $material in materials[]->slug.current)
    && ($status == null || status == $status)
  ] | order(itemNumber asc) {
    _id,
    itemNumber,
    "collection": fabric->{name, slug},
    "colorway": colorway->{name, slug},
    type,
    price,
    yardage,
    status,
    content,
    width,
    repeat,
    "categories": description[]->{name, slug},
    "colors": color[]->{name, slug, hexValue},
    "materials": materials[]->{name, slug},
    images[] {
      asset->,
      alt
    }
  }
`

// Get single fabric item by item number
export const fabricItemByNumberQuery = groq`
  *[_type == "fabricItem" && itemNumber == $itemNumber][0] {
    _id,
    itemNumber,
    "collection": fabric->{_id, name, slug, description, featuredImage},
    "colorway": colorway->{_id, name, slug, description},
    type,
    price,
    yardage,
    status,
    notes,
    content,
    width,
    repeat,
    "categories": description[]->{name, slug},
    "colors": color[]->{name, slug, hexValue},
    "materials": materials[]->{name, slug},
    images[] {
      asset->,
      alt
    }
  }
`

// Get all fabric collections
export const fabricCollectionsQuery = groq`
  *[_type == "fabricCollection"] | order(name asc) {
    _id,
    name,
    slug,
    description,
    featuredImage,
    "itemCount": count(*[_type == "fabricItem" && references(^._id)])
  }
`

// Get fabric collection by slug
export const fabricCollectionBySlugQuery = groq`
  *[_type == "fabricCollection" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    description,
    featuredImage,
    "items": *[_type == "fabricItem" && references(^._id)] | order(itemNumber asc) {
      _id,
      itemNumber,
      "fabric": fabric->{name, slug},
      "colorway": colorway->{name, slug},
      type,
      price,
      yardage,
      status,
      content,
      width,
      repeat,
      "categories": description[]->{name, slug},
      "colors": color[]->{name, slug, hexValue},
      "materials": materials[]->{name, slug},
      images[] {
        asset->,
        alt
      }
    }
  }
`

// Get all colorways
export const colorwaysQuery = groq`
  *[_type == "colorway"] | order(name asc) {
    _id,
    name,
    slug,
    description,
    "itemCount": count(*[_type == "fabricItem" && references(^._id)])
  }
`

// Get colorway by slug
export const colorwayBySlugQuery = groq`
  *[_type == "colorway" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    description,
    "items": *[_type == "fabricItem" && references(^._id)] | order(itemNumber asc) {
      _id,
      itemNumber,
      "fabric": fabric->{name, slug},
      "colorway": colorway->{name, slug},
      type,
      price,
      yardage,
      status,
      content,
      width,
      repeat,
      "categories": description[]->{name, slug},
      "colors": color[]->{name, slug, hexValue},
      "materials": materials[]->{name, slug},
      images[] {
        asset->,
        alt
      }
    }
  }
`

// Get all unique colors for filtering
export const colorsQuery = groq`
  *[_type == "color"] | order(name asc) {
    _id,
    name,
    slug,
    hexValue
  }
`

// Get all unique statuses
export const statusesQuery = groq`
  array::unique(*[_type == "fabricItem"].status)
`

// Get all unique materials for filtering
export const materialsQuery = groq`
  *[_type == "material"] | order(name asc) {
    _id,
    name,
    slug
  }
`

export const openStockItemsQuery = groq`
  *[_type == "openStockItem" && defined(images[0])
    && ($color == null || $color in colors[]->slug.current)
    && ($material == null || $material in materials[]->slug.current)
  ] | order(fabric asc) {
    _id,
    itemNumber,
    fabric,
    colorway,
    price,
    content,
    width,
    description,
    "colors": colors[]->{name, slug, hexValue},
    "materials": materials[]->{name, slug},
    images[] {
      asset->,
      alt
    }
  }
`

export const openStockColorsQuery = groq`
  *[_type == "color" && count(*[_type == "openStockItem" && references(^._id)]) > 0] | order(name asc) {
    _id,
    name,
    slug,
    hexValue,
    "itemCount": count(*[_type == "openStockItem" && references(^._id)])
  }
`

export const openStockMaterialsQuery = groq`
  *[_type == "material" && count(*[_type == "openStockItem" && references(^._id)]) > 0] | order(name asc) {
    _id,
    name,
    slug,
    "itemCount": count(*[_type == "openStockItem" && references(^._id)])
  }
`

export const contactPageQuery = groq`
  *[_type == "contactPage"][0] {
    _id,
    images[] {
      asset->,
      alt
    },
    content
  }
`
