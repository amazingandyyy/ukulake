/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['ukulake.amazyyy.com']
  },
  async headers () {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: 'upgrade-insecure-requests'
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig
