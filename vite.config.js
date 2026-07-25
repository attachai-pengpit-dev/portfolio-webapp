import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Served from https://attachai-pengpit-dev.github.io/portfolio-webapp/
  base: '/portfolio-webapp/',
  plugins: [react()],
})
