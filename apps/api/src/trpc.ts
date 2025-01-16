import { initTRPC } from '@trpc/server'
import supabase from './plugins/supabase'
import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify'

export async function createContext({ req, res }: CreateFastifyContextOptions) {
  return { 
    supabase,
  }
}

export const t = initTRPC.context<typeof createContext>().create()

export const router = t.router
export const publicProcedure = t.procedure  