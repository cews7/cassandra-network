import { initTRPC } from '@trpc/server'
import supabase from './plugins/supabase'
import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify'

// Define the context type
interface Context {
  supabase: typeof supabase;
  req?: CreateFastifyContextOptions['req'];
  res?: CreateFastifyContextOptions['res'];
}

export async function createContext({ req, res }: CreateFastifyContextOptions): Promise<Context> {
  return { 
    supabase,
    req,
    res,
  }
}

const t = initTRPC.context<Context>().create({
  // Add error formatting if needed
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof Error ? error.cause.message : null,
      },
    }
  },
})

export const router = t.router
export const publicProcedure = t.procedure  