/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
    // Ignore linting errors during the build
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true, // Skip TypeScript errors during builds
  },
}

module.exports = nextConfig
