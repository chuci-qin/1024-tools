import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

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
  // 注意：COOP/COEP 头部只应用于 code-editor 页面，其他页面使用宽松策略以支持 Vercel Analytics
  async headers() {
    return [
      {
        // code-editor 页面需要严格的 COOP/COEP 头部来支持 WebContainer
        source: '/trading/code-editor',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
        ],
      },
      {
        // 其他所有页面使用宽松的 COEP 策略，允许加载 Vercel Analytics 等跨域资源
        source: '/((?!trading/code-editor).*)',
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
  webpack: (config, { isServer }) => {
    // Ignore pino-pretty (optional dependency of pino used by WalletConnect)
    config.resolve.fallback = {
      ...config.resolve.fallback,
      'pino-pretty': false,
    };

    // Ignore encoding module warnings (optional dependency)
    config.resolve.alias = {
      ...config.resolve.alias,
      encoding: false,
    };

    return config;
  },
}

export default withNextIntl(nextConfig);
