/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  transpilePackages: [
    '@pado/ui',
    '@pado/i18n',
    '@pado/locales',
    '@pado/tailwind-design-tokens',
    '@pado/tailwind-semantic-tokens',
    '@pado/eslint-config-custom',
  ],

  turbopack: {
    resolveExtensions: [
      '.web.tsx',
      '.web.ts',
      '.web.jsx',
      '.web.js',
      '.tsx',
      '.ts',
      '.jsx',
      '.js',
      '.json',
    ],
  },

  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
