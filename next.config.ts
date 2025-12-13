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
};

export default nextConfig;