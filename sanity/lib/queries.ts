import { groq } from "next-sanity"

// Get all fabric items with related data
export const fabricItemsQuery = groq`
  *[_type == "fabricItem"] | order(itemNumber asc) {
    _id,
    itemNumber,
    "fabric": fabric->name,
    "fabricSlug": fabric->slug.current,
    "colorway": colorway->name,
    "colorwaySlug": colorway->slug.current,
    type,
    price,
    yardage,
    status,
    notes,
    content,
    width,
    repeat,
    "categories": description[]->name,
    "colors": color[]->name,
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
    "fabric": fabric->{name, slug, description, featuredImage},
    "colorway": colorway->{name, slug, description},
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
    "items": *[_type == "fabricItem" && references(^._id)] {
      itemNumber,
      "colorway": colorway->name,
      price,
      yardage,
      status,
      images[0]
    }
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
      "colorway": colorway->{name, slug},
      type,
      price,
      yardage,
      status,
      content,
      width,
      repeat,
      "categories": description[]->name,
      "colors": color[]->name,
      images[] {
        asset->,
        alt
      }
    }
  }
`
