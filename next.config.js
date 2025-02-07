/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, options) => {
    // Disable cache in development
    if (options.dev) {
      config.cache = false
    }
    return config
  },
}

module.exports = nextConfig