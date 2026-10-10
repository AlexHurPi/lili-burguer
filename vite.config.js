import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  // base: '/lili-burguer/', // Raíz para GitHub Pages
  base: '/', // Raíz para Cloudflare Pages
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icono-192.png', 'icono-512.png', 'imagen-compartir.jpg'],
      manifest: {
        name: 'Lili Hamburger',
        short_name: 'Lili Ham',
        description: 'Menú digital de Lili Hamburger',
        theme_color: '#ff4e3e',
        background_color: '#1a2225',
        display: 'standalone',
        //Se quita /lili-burguer/ de la ruta de inicio
        start_url: './', 
        icons: [
          {
            src: 'icono-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icono-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})