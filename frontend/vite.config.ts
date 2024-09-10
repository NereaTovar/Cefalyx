import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // Establece una ruta base relativa
  build: {
    outDir: 'dist', // Asegura que el directorio de salida sea `dist`
    assetsDir: 'assets', // Para mantener los assets en un directorio llamado 'assets'
  },
})
