import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves this project from https://<user>.github.io/Haushaltsrechner/,
  // so assets must be referenced relative to that subpath.
  base: '/Haushaltsrechner/',
  plugins: [react()],
})
