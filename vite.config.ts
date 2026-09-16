import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    base: './',
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || ''),
      ...(env.VITE_API_URL ? { 'process.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL) } : {}),
      ...(env.VITE_WS_URL ? { 'process.env.VITE_WS_URL': JSON.stringify(env.VITE_WS_URL) } : {}),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: {
        ignored: ['**/uploads/**'],
      },
    },
    build: {
      outDir: 'dist',
      target: 'es2020',
      sourcemap: false,
      minify: 'esbuild',
      cssCodeSplit: true,
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('firebase')) {
                return 'firebase-vendor';
              }
              if (id.includes('react') || id.includes('react-dom')) {
                return 'react-vendor';
              }
              if (id.includes('lucide-react') || id.includes('motion')) {
                return 'ui-vendor';
              }
              return 'vendor';
            }
          },
        },
      },
    },
  };
});
