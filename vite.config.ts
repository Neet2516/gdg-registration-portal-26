import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const backendUrl = (env.NEXT_PUBLIC_BACKEND_URL || env.BACKEND_URL || 'https://proximety-7nt5.vercel.app').trim();

  const server = backendUrl
    ? (() => {
        const target = new URL(backendUrl);
        const backendPath = target.pathname.replace(/\/+$/, '').replace(/\/api\/v1$/, '');

        return {
          proxy: {
            '/api/v1': {
              target: target.origin,
              changeOrigin: true,
              rewrite: (path: string) => {
                const endpointPath = path.replace(/^\/api\/v1/, '');
                return endpointPath
                  ? `${backendPath}/api/v1${endpointPath}`
                  : backendPath || '/';
              },
            },
          },
        };
      })()
    : undefined;

  return {
    plugins: [react(), tailwindcss()],
    server,
    assetsInclude: ['**/*.glb'],
    build: {
      chunkSizeWarningLimit: 1600,
    },
  };
});
