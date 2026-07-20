import { redirect } from "next/navigation"

// Phase 1: the Shop section only contains Furniture, so /shop redirects there.
// When Accessories launch (Phase 2), this can become a Shop landing page.
export default function ShopPage() {
  redirect("/shop/furniture")
}
