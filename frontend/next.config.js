/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    // Disable static page generation for pages that use Firebase
    outputFileTracingIncludes: {
      '/': ['./node_modules/**/*.wasm', './node_modules/**/*.node'],
    },
  },
  // Don't try to prerender pages during build
  // This prevents Firebase auth errors during build time
  exportPathMap: async function () {
    return {};
  },
}

module.exports = nextConfig
