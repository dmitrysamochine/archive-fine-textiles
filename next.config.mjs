/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Open Stock Fabrics is temporarily hidden. Redirect the section (and any deep
  // links into it) to the homepage so visitors who land there aren't stranded.
  // Remove this block when the section is restored to the nav.
  async redirects() {
    return [
      {
        source: "/open-stock",
        destination: "/",
        permanent: false,
      },
      {
        source: "/open-stock/:path*",
        destination: "/",
        permanent: false,
      },
    ]
  },
}

export default nextConfig
