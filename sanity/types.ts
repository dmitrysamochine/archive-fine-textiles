export interface FabricItem {
  _id: string
  itemNumber: string
  fabric: {
    name: string
    slug: {
      current: string
    }
    description?: string
    featuredImage?: {
      asset: {
        _id: string
        url: string
      }
    }
  }
  colorway: {
    name: string
    slug: {
      current: string
    }
    description?: string
  }
  type: "wing" | "flat"
  price: number
  yardage: number
  status: "in-stock" | "low-stock" | "out-of-stock"
  notes?: string
  content?: string
  width?: string
  repeat?: string
  categories?: Array<{
    name: string
    slug: {
      current: string
    }
  }>
  colors?: Array<{
    name: string
    slug: {
      current: string
    }
    hexValue?: string
  }>
  images?: Array<{
    asset: {
      _id: string
      url: string
    }
    alt?: string
  }>
}

export interface FabricCollection {
  _id: string
  name: string
  slug: {
    current: string
  }
  description?: string
  featuredImage?: {
    asset: {
      _id: string
      url: string
    }
  }
  itemCount?: number
  items?: FabricItem[]
}

export interface Colorway {
  _id: string
  name: string
  slug: {
    current: string
  }
  description?: string
  itemCount?: number
  items?: FabricItem[]
}

export interface Category {
  _id: string
  name: string
  slug: {
    current: string
  }
}

export interface Color {
  _id: string
  name: string
  slug: {
    current: string
  }
  hexValue?: string
}
