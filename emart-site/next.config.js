/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'e-mart.com.bd', pathname: '/wp-content/uploads/**' },
      { protocol: 'https', hostname: 'secure.gravatar.com' },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [390, 640, 768, 1024, 1280, 1920],
    imageSizes: [150, 300, 600],
  },
  async headers() {
    return [
      { source: '/(.*)', headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
      ]},
    ];
  },
};
module.exports = nextConfig;
