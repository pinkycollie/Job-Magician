/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output for production deployment
  output: 'standalone',
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  
  // Environment configuration
  env: {
    NEXT_PUBLIC_APP_NAME: 'Job-Magician',
    NEXT_PUBLIC_APP_VERSION: '1.0.0',
  },
}

export default nextConfig