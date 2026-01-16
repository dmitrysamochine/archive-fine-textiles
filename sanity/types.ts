export interface FabricItem {
  _id: string
  itemNumber: string
  collection?: {
    _id?: string
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
    _id?: string
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
  materials?: Array<{
    name: string
    slug: {
      current: string
    }
  }>
  images?: Array<{
    asset: {
      _id: string
      url: string
    }
    alt?: string
  }>
  composition?: string
  origin?: string
  description?: string
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

export interface Material {
  _id: string
  name: string
  slug: {
    current: string
  }
}

export interface ContactPage {
  _id: string
  images: Array<{
    asset: {
      _id: string
      url: string
    }
    alt?: string
  }>
  content: any[] // Portable Text blocks
}

export interface OpenStockItem {
  _id: string
  itemNumber: string
  fabric: string
  colorway: string
  price: number
  content?: string
  width?: string
  description?: string
  colors?: Array<{
    name: string
    slug: {
      current: string
    }
    hexValue?: string
  }>
  materials?: Array<{
    name: string
    slug: {
      current: string
    }
  }>
  images?: Array<{
    asset: {
      _id: string
      url: string
    }
    alt?: string
  }>
}
