import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/*.svg'],
      manifest: {
        name: 'LUMA | لوما',
        short_name: 'LUMA',
        description: 'پلتفرم تاروت، استرولوژی و خودشناسی',
        theme_color: '#0B0D1A',
        background_color: '#0B0D1A',
        display: 'standalone',
        orientation: 'portrait',
        lang: 'fa',
        dir: 'rtl',
        icons: []
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,webp,woff2,mp3}'],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        cleanupOutdatedCaches: true
      }
    })
  ],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } }
})
