import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker optimization
  output: 'standalone',

  // Rewrites para proxy das imagens e API em ambiente Docker
  async rewrites() {
    const isDocker = process.env.NODE_ENV === 'development' && process.env.DOCKER_ENV;
    const backendUrl = isDocker ? 'http://backend:4000' : 'http://localhost:4000';
    
    return [
      // Proxy para a API completa
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
      // Proxy para uploads
      {
        source: '/api/uploads/:path*',
        destination: `${backendUrl}/uploads/:path*`,
      },
    ];
  },

  // Image configuration for external sources
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'backend',
        port: '4000',
        pathname: '/uploads/**',
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Desabilitar otimização para desenvolvimento
    unoptimized: process.env.NODE_ENV === 'development',
    // Permitir URLs locais (para o proxy)
    domains: ['localhost'],
  },

  // Experimental features to improve performance
  experimental: {
    // Reduce bundle size with optimized imports
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },

  // Webpack configuration for better Windows support
  webpack: (config, { dev }) => {
    if (dev) {
      // Reduce file watchers in development
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: ['**/node_modules', '**/.next'],
      };
    }
    return config;
  },

  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
};

export default nextConfig;
