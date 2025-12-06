/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Limit linting to app and shared components
    dirs: [
      'src/app',
      'src/components',
    ],
  },
  
  // Required headers for WebContainer (SharedArrayBuffer support)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'unsafe-none',
          },
        ],
      },
    ];
  },

  // Webpack configuration to handle optional dependencies
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      'pino-pretty': false,
    };

    config.resolve.alias = {
      ...config.resolve.alias,
      encoding: false,
    };

    return config;
  },
}

export default nextConfig;
