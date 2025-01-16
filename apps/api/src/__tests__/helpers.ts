import { buildApp } from '../server'
import { FastifyInstance } from 'fastify'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
export async function createTestServer(): Promise<FastifyInstance> {
  const app = await buildApp({ testing: true })
  return app
}

export async function closeTestServer(app: FastifyInstance): Promise<void> {
  try {
    await app.close()
    // Give it a moment to fully close
    await new Promise(resolve => setTimeout(resolve, 500))
  } catch (err) {
    console.error('Error closing test server:', err)
  }
} 

export async function cleanDatabase() {
  await prisma.user.deleteMany()
}