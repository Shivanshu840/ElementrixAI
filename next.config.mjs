/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  serverExternalPackages: ['redis', '@redis/client'],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Completely exclude server-only modules from client bundle
      config.resolve.alias = {
        ...config.resolve.alias,
        '@/lib/redis': false,
        'redis': false,
        '@redis/client': false,
      }

      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        'node:crypto': false,
        'node:fs': false,
        'node:net': false,
        'node:tls': false,
        'redis': false,
      }
    }
    return config
  },
}

export default nextConfig
