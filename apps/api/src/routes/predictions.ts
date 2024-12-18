import { z } from 'zod'
import { router, publicProcedure } from '../trpc'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const predictionsRouter = router({
  create: publicProcedure
    .input(z.object({
      content: z.string(),
      expectedDate: z.string().transform(str => new Date(str)),
    }))
    .mutation(async ({ input }) => {
      return prisma.prediction.create({
        data: {
          content: input.content,
          expectedDate: input.expectedDate,
          status: 'pending',
        }
      })
    }),

  list: publicProcedure
    .query(async () => {
      return prisma.prediction.findMany({
        orderBy: { createdAt: 'desc' }
      })
    }),

  byId: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return prisma.prediction.findUnique({
        where: { id: input }
      })
    })
}) 