/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'raw.githubusercontent.com' },
      { protocol: 'https', hostname: 'market-assets.fra1.cdn.digitaloceanspaces.com' },
      { protocol: 'https', hostname: '**.sketchfab.com' },
      { protocol: 'https', hostname: 'i.imgur.com' },
    ],
  },
  // Allow WebXR iframe + COOP/COEP for SharedArrayBuffer
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
        ],
      },
    ];
  },
  webpack(config) {
    // Needed for @react-three/fiber + drei
    config.externals = config.externals || [];
    return config;
  },
};

module.exports = nextConfig;
