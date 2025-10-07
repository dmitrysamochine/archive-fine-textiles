"use client"

import dynamic from "next/dynamic"

const NextStudio = dynamic(() => import("next-sanity/studio").then((mod) => mod.NextStudio), {
  ssr: false,
})

const StudioPage = dynamic(
  () =>
    import("@/sanity/config").then((mod) => {
      const config = mod.default
      return () => <NextStudio config={config} />
    }),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Loading Sanity Studio...</div>
      </div>
    ),
  },
)

export default StudioPage
