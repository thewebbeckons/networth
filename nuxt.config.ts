// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/ui', '@nuxt/hints', '@vueuse/nuxt', 'nuxt-charts'],

  // Enable SSG mode (required for Tauri - it cannot run SSR)
  ssr: false,

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  // Disable telemetry
  telemetry: { enabled: false },

  // Dev server configuration for Tauri
  devServer: {
    host: '0.0.0.0'
  },

  // Vite configuration for Tauri compatibility
  vite: {
    clearScreen: false,
    envPrefix: ['VITE_', 'TAURI_'],
    server: {
      strictPort: true
    }
  },

  // Ignore Tauri source files in Nuxt watch
  ignore: ['**/src-tauri/**'],

  compatibilityDate: '2025-01-15',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})