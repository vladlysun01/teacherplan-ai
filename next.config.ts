import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Додаткові налаштування для ігнорування помилок
  experimental: {
    // @ts-ignore
    turbo: {
      rules: {
        '*.ts': {
          loaders: ['ts-loader'],
          as: '*.js',
        },
      },
    },
  },
  // Базові security-заголовки — застосовуються до всіх відповідей.
  // Захищають від clickjacking (сайт у чужому iframe), MIME-sniffing
  // атак та випадкового витоку повного URL (з токенами в query) через
  // заголовок Referer при переході на сторонні сайти.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        ],
      },
    ];
  },
  // Перенесено з видаленого next.config.js — виключаємо Node.js модулі з client-side bundle
  webpack: (config, { isServer }) => {
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
};

export default nextConfig;