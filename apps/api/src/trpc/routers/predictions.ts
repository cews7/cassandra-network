import { z } from 'zod'
import { router, publicProcedure } from '../trpc'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const predictionsRouter = router({
  create: publicProcedure
    .input(z.object({
      title: z.string(),
      text: z.string(),
      timeframe: z.enum(['IMMEDIATE', 'NEAR', 'MEDIUM', 'LONG']),
      dueDate: z.string().transform(str => new Date(str)),
      userId: z.string()
    }))
    .mutation(async ({ input }) => {
      return prisma.prediction.create({
        data: {
          title: input.title,
          text: input.text,
          timeframe: input.timeframe,
          dueDate: input.dueDate,
          status: 'ACTIVE',
          userId: input.userId
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