import { createTRPCNuxtClient, httpBatchLink } from 'trpc-nuxt/client'
import type { AppRouter } from '../../api/src/server'
import { useRuntimeConfig } from '#app'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  
  const client = createTRPCNuxtClient<AppRouter>({
    links: [
      httpBatchLink({
        url: config.public.apiUrl,
        headers: () => ({
          // Add any headers if needed
        }),
      }),
    ],
  })

  return {
    provide: {
      trpc: client
    }
  }
})