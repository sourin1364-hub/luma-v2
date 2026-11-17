import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  base: process.env.CAPACITOR_BUILD === 'true' ? './' : '/luma-v2/',
  plugins: [
    react(),
    VitePWA({
      devOptions: { enabled: false },
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/*.svg', 'icons/*.png'],
      manifest: false,
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,woff2}'],
        globIgnores: ['**/assets/tarot/cards/**', '**/*.mp3'],
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [/^\/api/, /^\/supabase/, /\.apk$/],
        runtimeCaching: [
          {
            urlPattern: /\.(?:png|jpg|jpeg|webp|gif)$/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'luma-images-v2',
              expiration: {
                maxEntries: 250,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
            },
          },
        ],
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/node_modules/three/')) return 'three-vendor'
        },
      },
    },
  },
  resolve: { alias: { '@': path.resolve(__dirname, './src') } }
})
