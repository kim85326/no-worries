import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

const isProd = process.env.NODE_ENV === 'production'
const base = isProd ? '/no-worries/' : '/'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  base,
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
