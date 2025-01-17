import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import type { AppRouter } from '../../api/src/server'

// Create the tRPC client
export const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3001/trpc',
      // You can add headers here if needed
      headers: () => ({}),
    }),
  ],
}) 