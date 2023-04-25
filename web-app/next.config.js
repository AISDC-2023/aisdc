/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  distDir: 'dist',
  images: {
    unoptimized: true
  },
  reactStrictMode: false,
  experimental: {
    scrollRestoration: true,
  },
}

module.exports = nextConfig
