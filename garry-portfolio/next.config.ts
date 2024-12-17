import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  sassOptions: {
    implementation: 'sass-embedded',
  },
  reactStrictMode: false,
}

export default nextConfig
