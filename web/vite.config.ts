import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  // `npm run dev:hp` = HTTPS + bisa diakses dari HP di jaringan yang sama (kamera wajib HTTPS)
  plugins: [react(), tailwindcss(), ...(mode === 'hp' ? [basicSsl()] : [])],
  server: mode === 'hp' ? { host: true } : undefined,
}))
