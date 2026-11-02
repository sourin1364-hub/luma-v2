import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  base: '/luma-v2/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/*.svg', 'icons/*.png'],
      manifest: false, // از public/manifest.webmanifest استفاده می‌شود
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,webp,woff2,mp3}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        cleanupOutdatedCaches: true,
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [/^\/api/, /^\/supabase/]
      },
      devOptions: {
        enabled: true,
        type: 'module'
      }
    })
  ],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } }
})