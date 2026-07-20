import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    // Honor a host-assigned port (preview/container environments) and fall
    // back to Vite's default when none is set.
    port: process.env.PORT ? Number(process.env.PORT) : 5173,
  },
})
