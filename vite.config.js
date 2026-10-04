import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/lili-burguer/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icono-192.png', 'icono-512.png', 'imagen-compartir.jpg'],
      manifest: {
        name: 'Lili Admin', // Puedes cambiar el nombre para distinguirla de la app de clientes
        short_name: 'Lili Admin',
        description: 'Panel de administración de Lili Burguer',
        theme_color: '#ff4e3e',
        background_color: '#1a2225',
        display: 'standalone',
        // 👇 AQUÍ ESTÁ EL CAMBIO CLAVE: Agregamos el hash y la ruta
        start_url: '/lili-burguer/#/admin', 
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