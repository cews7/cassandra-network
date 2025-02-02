import { createNuxtApiHandler } from 'trpc-nuxt'
import { appRouter } from '../src/server'
import { createContext } from '../src/trpc/context'

// export API handler
export default createNuxtApiHandler({
  router: appRouter,
  createContext,
})
