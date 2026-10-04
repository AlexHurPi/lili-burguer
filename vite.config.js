import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/lili-burguer/', // Tu subruta de GitHub Pages
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // Actualiza la app automáticamente en el celular del cliente si hay cambios
      includeAssets: ['icono-192.png', 'icono-512.png', 'imagen-compartir.jpg'],
      manifest: {
        name: 'Lili Burguer',
        short_name: 'Lili Burguer',
        description: 'Menú digital de Lili Burguer',
        theme_color: '#ff4e3e',
        background_color: '#1a2225',
        display: 'standalone',
        start_url: '/lili-burguer/',
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