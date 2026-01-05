/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Виключаємо Node.js модулі з client-side bundle
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: false,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
  async headers() {
    return [
      {
        source: '/payment/:path*',
        headers: [
          {
            key: 'Permissions-Policy',
            value: 'payment=(self "https://secure.wayforpay.com")',
          },
          {
            key: 'Feature-Policy',
            value: 'payment "self" https://secure.wayforpay.com',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
