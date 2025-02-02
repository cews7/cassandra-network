import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import type { AppRouter } from '../../api/src/server'

export const useClient = () => {
  const config = useRuntimeConfig()
  
  return createTRPCProxyClient<AppRouter>({
    links: [
      httpBatchLink({
        url: config.public.apiUrl,
        headers: () => ({}),
      }),
    ],
  })
} 