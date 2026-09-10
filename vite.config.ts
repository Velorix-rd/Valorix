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
      sourcemap: false,
      minify: 'esbuild',
      cssCodeSplit: true,
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'firebase-vendor': ['firebase/app', 'firebase/firestore', 'firebase/auth', 'firebase/storage'],
            'ui-vendor': ['lucide-react', 'motion'],
            'utils-vendor': ['date-fns', 'clsx', 'tailwind-merge', 'qrcode.react'],
          },
        },
      },
    },
  };
});
