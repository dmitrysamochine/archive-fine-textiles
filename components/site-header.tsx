import Link from "next/link"

export function SiteHeader() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="text-xl font-serif font-bold">
            Archive Fine Textiles
          </Link>
          <ul className="flex items-center gap-6">
            <li>
              <Link href="/fabrics" className="text-sm hover:underline">
                Fabrics
              </Link>
            </li>
            <li>
              <Link href="/collections" className="text-sm hover:underline">
                Collections
              </Link>
            </li>
            <li>
              <Link href="/colorways" className="text-sm hover:underline">
                Colorways
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
