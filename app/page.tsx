import { HeroGrid } from "@/components/hero-grid"
import { FabricGrid } from "@/components/fabric-grid"

export default function Page() {
  return (
    <div className="min-h-screen">
      <HeroGrid />

      <FabricGrid />
    </div>
  )
}
