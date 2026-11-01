# LUMA v2 - Project Setup Script
Write-Host "Setting up LUMA v2..." -ForegroundColor Cyan
$ErrorActionPreference = "Continue"

# ---- package.json ----
$packageJson = @"
{
  `"name`": `"luma-v2`",
  `"private`": true,
  `"version`": `"2.0.0`",
  `"type`": `"module`",
  `"scripts`": {
    `"dev`": `"vite`",
    `"build`": `"tsc -b && vite build`",
    `"preview`": `"vite preview`",
    `"lint`": `"oxlint src`",
    `"test`": `"vitest run`",
    `"test:watch`": `"vitest`",
    `"test:e2e`": `"playwright test`",
    `"typecheck`": `"tsc --noEmit`"
  },
  `"dependencies`": {
    `"@supabase/supabase-js`": `"2.45.4`",
    `"astronomy-engine`": `"2.1.19`",
    `"class-variance-authority`": `"0.7.0`",
    `"clsx`": `"2.1.1`",
    `"dexie`": `"4.0.8`",
    `"dexie-react-hooks`": `"1.1.7`",
    `"framer-motion`": `"11.11.9`",
    `"jalaali-js`": `"1.2.7`",
    `"lucide-react`": `"0.453.0`",
    `"react`": `"18.3.1`",
    `"react-dom`": `"18.3.1`",
    `"tailwind-merge`": `"2.5.4`",
    `"zustand`": `"5.0.0`"
  },
  `"devDependencies`": {
    `"@playwright/test`": `"1.48.1`",
    `"@testing-library/jest-dom`": `"6.5.0`",
    `"@testing-library/react`": `"16.0.1`",
    `"@types/node`": `"22.7.9`",
    `"@types/react`": `"18.3.11`",
    `"@types/react-dom`": `"18.3.1`",
    `"@vitejs/plugin-react`": `"4.3.2`",
    `"autoprefixer`": `"10.4.20`",
    `"jsdom`": `"25.0.1`",
    `"oxlint`": `"0.9.10`",
    `"postcss`": `"8.4.47`",
    `"prettier`": `"3.3.3`",
    `"tailwindcss`": `"3.4.14`",
    `"typescript`": `"5.6.3`",
    `"vite`": `"5.4.10`",
    `"vite-plugin-pwa`": `"0.20.5`",
    `"vitest`": `"2.1.3`"
  }
}
"@
$packageJson | Out-File -FilePath "package.json" -Encoding UTF8 -NoNewline
Write-Host "package.json created." -ForegroundColor Green

# ---- vite.config.ts ----
$viteConfig = @"
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
"@
$viteConfig | Out-File -FilePath "vite.config.ts" -Encoding UTF8
Write-Host "vite.config.ts created." -ForegroundColor Green

# ---- vitest.config.ts ----
$vitestConfig = @"
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
    include: ['tests/unit/**/*.test.ts']
  },
  resolve: { alias: { '@': path.resolve(__dirname, './src') } }
})
"@
$vitestConfig | Out-File -FilePath "vitest.config.ts" -Encoding UTF8

# ---- tsconfig.json ----
$tsconfig = @"
{
  `"compilerOptions`": {
    `"target`": `"ES2022`",
    `"useDefineForClassFields`": true,
    `"lib`": [`"ES2022`", `"DOM`", `"DOM.Iterable`"],
    `"module`": `"ESNext`",
    `"skipLibCheck`": true,
    `"moduleResolution`": `"bundler`",
    `"allowImportingTsExtensions`": true,
    `"resolveJsonModule`": true,
    `"isolatedModules`": true,
    `"noEmit`": true,
    `"jsx`": `"react-jsx`",
    `"strict`": true,
    `"noUnusedLocals`": true,
    `"noUnusedParameters`": true,
    `"noFallthroughCasesInSwitch`": true,
    `"baseUrl`": `".`",
    `"paths`": { `"@/*`": [`"src/*`"] }
  },
  `"include`": [`"src`", `"tests`", `"vite.config.ts`", `"vitest.config.ts`"]
}
"@
$tsconfig | Out-File -FilePath "tsconfig.json" -Encoding UTF8
Write-Host "tsconfig.json created." -ForegroundColor Green

# ---- tailwind.config.js ----
$tailwind = @"
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'luma-navy': '#0B0D1A',
        'luma-gold': '#D6B56D',
        'luma-purple': '#4A2D6B'
      },
      fontFamily: {
        sans: ['Vazirmatn', 'system-ui', 'sans-serif'],
        display: ['Cormorant Garamond', 'serif']
      }
    }
  },
  plugins: []
}
"@
$tailwind | Out-File -FilePath "tailwind.config.js" -Encoding UTF8

# ---- postcss.config.js ----
$postcss = @"
export default {
  plugins: { tailwindcss: {}, autoprefixer: {} }
}
"@
$postcss | Out-File -FilePath "postcss.config.js" -Encoding UTF8

# ---- index.html ----
$indexHtml = @"
<!doctype html>
<html lang='fa' dir='rtl'>
  <head>
    <meta charset='UTF-8' />
    <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' />
    <meta name='theme-color' content='#0B0D1A' />
    <title>LUMA | لوما</title>
  </head>
  <body>
    <div id='root'></div>
    <script type='module' src='/src/main.tsx'></script>
  </body>
</html>
"@
$indexHtml | Out-File -FilePath "index.html" -Encoding UTF8
Write-Host "Config files created." -ForegroundColor Green

# ---- src/main.tsx ----
$mainTsx = @"
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
"@
$mainTsx | Out-File -FilePath "src\main.tsx" -Encoding UTF8

# ---- src/App.tsx ----
$appTsx = @"
function App() {
  return (
    <div className='min-h-screen bg-luma-navy flex items-center justify-center text-luma-gold'>
      <div className='text-center'>
        <h1 className='text-4xl font-display tracking-widest'>LUMA</h1>
        <p className='mt-2 text-sm opacity-70'>v2.0 - Foundation Ready</p>
      </div>
    </div>
  )
}
export default App
"@
$appTsx | Out-File -FilePath "src\App.tsx" -Encoding UTF8

# ---- src/styles/index.css ----
$css = @"
@tailwind base;
@tailwind components;
@tailwind utilities;

html, body, #root { height: 100%; }
body { font-family: 'Vazirmatn', system-ui, sans-serif; }
"@
$css | Out-File -FilePath "src\styles\index.css" -Encoding UTF8
Write-Host "Source files created." -ForegroundColor Green

# ---- tests/setup.ts ----
$testSetup = @"
import '@testing-library/jest-dom'
"@
$testSetup | Out-File -FilePath "tests\setup.ts" -Encoding UTF8

# ---- tests/unit/engines/calendar.test.ts ----
$calendarTest = @"
import { describe, it, expect } from 'vitest'
import { toJalaali, toGregorian, isLeapJalaaliYear } from 'jalaali-js'

describe('Jalaali Calendar Engine', () => {
  it('converts 1403/01/01 to 2024/03/20', () => {
    const g = toGregorian(1403, 1, 1)
    expect(g.gy).toBe(2024)
    expect(g.gm).toBe(3)
    expect(g.gd).toBe(20)
  })
  it('converts 2024/03/20 to 1403/01/01', () => {
    const j = toJalaali(2024, 3, 20)
    expect(j.jy).toBe(1403)
    expect(j.jm).toBe(1)
    expect(j.jd).toBe(1)
  })
  it('correctly identifies leap year 1403', () => {
    expect(isLeapJalaaliYear(1403)).toBe(true)
  })
  it('correctly identifies non-leap year 1404', () => {
    expect(isLeapJalaaliYear(1404)).toBe(false)
  })
})
"@
$calendarTest | Out-File -FilePath "tests\unit\engines\calendar.test.ts" -Encoding UTF8

# ---- .gitignore ----
$gitignore = @"
node_modules
dist
.env
.env.local
*.log
.DS_Store
coverage
playwright-report
test-results
"@
$gitignore | Out-File -FilePath ".gitignore" -Encoding UTF8

# ---- .env.example ----
$envExample = @"
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
"@
$envExample | Out-File -FilePath ".env.example" -Encoding UTF8

Write-Host ""
Write-Host "All files created. Installing dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "npm install failed! Check network." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "Dependencies installed." -ForegroundColor Green

Write-Host ""
Write-Host "Running tests..." -ForegroundColor Yellow
npm test
if ($LASTEXITCODE -eq 0) {
    Write-Host "All tests passed!" -ForegroundColor Green
} else {
    Write-Host "Some tests failed. Check output above." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Initializing Git..." -ForegroundColor Yellow
git init | Out-Null
git add .
git commit -m "chore: bootstrap LUMA v2 project foundation" | Out-Null

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  LUMA v2 Setup Complete!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Next step: npm run dev" -ForegroundColor Yellow
Read-Host "Press Enter to close"
