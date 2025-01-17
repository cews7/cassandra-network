// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/tailwindcss',
    'nuxt-icon'
  ],
  app: {
    pageTransition: {
      name: 'page',
      mode: 'out-in'
    }
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  runtimeConfig: {
    apiUrl: process.env.NUXT_API_URL || 'http://api:3001/trpc',
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:3001/trpc'
    }
  },
  build: {
    transpile: ['trpc-nuxt']
  },
  alias: {
    '@api-types': '../../apps/api/src'
  }
})
