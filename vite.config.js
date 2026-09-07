import { defineConfig } from "vite";
import react from '@vitejs/plugin-react'

//https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',//This maps the '@' alias to your 'src' directory
      //You can add more aliases as needed, e.g.:
      // 'components': '/src/components',
      //'utils': '/src/utils',
    },
  },
})