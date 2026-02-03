/** @type {import('next').NextConfig} */
const nextConfig = {
  // SEO: Consistent URLs without trailing slashes
  trailingSlash: false,

  // SEO: Skip build errors for static generation (helps with dynamic routes)
  skipTrailingSlashRedirect: false,

  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'achievingcoach.com',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
    ],
  },
  
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Performance
  reactStrictMode: true,
  swcMinify: true,
  
  // Compression
  compress: true,
  
  // Redirects for SEO (fixing old URLs)
  async redirects() {
    return [
      {
        source: '/search',
        destination: '/blog',
        permanent: true,
      },
    ];
  },

  // Headers for caching
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            // Prevent aggressive CDN caching for HTML pages
            // Use short cache with revalidation to ensure fresh content
            key: 'Cache-Control',
            value: 'public, max-age=0, s-maxage=60, stale-while-revalidate=300',
          },
        ],
      },
      {
        // Static assets with hashes can be cached long-term
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};
module.exports = nextConfig;
