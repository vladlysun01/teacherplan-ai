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