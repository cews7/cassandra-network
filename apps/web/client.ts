import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import type { AppRouter } from '../api/src/server'

// Function to create the client with runtime config
export const client = (baseUrl: string) => {
  return createTRPCProxyClient<AppRouter>({
    links: [
      httpBatchLink({
        url: baseUrl,
        headers: () => ({}),
      }),
    ],
  })
}