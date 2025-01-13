import { build } from '../app'
import { FastifyInstance } from 'fastify'

export async function createTestServer(): Promise<FastifyInstance> {
  const app = await build({ testing: true })
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