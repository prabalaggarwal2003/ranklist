import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa';


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.svg',
        'robots.txt',
        'icons/icon-192x192.png',
        'icons/icon-512x512.png'
      ],
      manifest: {
        name: 'BPIT Student Leaderboard',
        short_name: 'BPIT Leaderboard',
        description:
          'Live coding challenge leaderboard for BPIT students—integrating LeetCode, Codeforces, and GitHub.',
        theme_color: '#0056b3',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/ranklist\.bpitindia\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'bpitleaderboard-static'
            }
          },
          {
            urlPattern: /^https:\/\/leetcode\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'leetcode-cache'
            }
          },
          {
            urlPattern: /^https:\/\/codeforces\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'codeforces-cache'
            }
          },
          {
            urlPattern: /^https:\/\/api\.github\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'github-cache'
            }
          },
          {
            urlPattern: /^https:\/\/.*googleapis\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'google-sheets-cache'
            }
          }
        ]
      }
    })
  ],
  server: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
  
})
