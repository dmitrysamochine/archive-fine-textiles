import type { ShopSettings } from "@/sanity/types"

// Format a whole-dollar USD price, e.g. 14500 -> "$14,500"
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price)
}

// Build a mailto: link pre-filled with an inquiry subject for a given piece
export function buildInquiryMailto(email: string | undefined, itemTitle: string): string | null {
  if (!email) return null
  const subject = encodeURIComponent(`Purchase inquiry: ${itemTitle}`)
  const body = encodeURIComponent(`I'm interested in "${itemTitle}". Please share availability and next steps.`)
  return `mailto:${email}?subject=${subject}&body=${body}`
}

// Build a tel: link, stripping formatting characters from the phone number
export function buildTelLink(phone: string | undefined): string | null {
  if (!phone) return null
  const normalized = phone.replace(/[^\d+]/g, "")
  return `tel:${normalized}`
}

// Convenience accessors with sensible fallbacks
export function getPurchaseEmail(settings?: ShopSettings | null): string | undefined {
  return settings?.purchaseEmail || undefined
}

export function getPurchasePhone(settings?: ShopSettings | null): string | undefined {
  return settings?.purchasePhone || undefined
}
