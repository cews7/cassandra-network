import { config } from 'dotenv'
import { join } from 'path'

// Load test environment variables
config({ path: join(__dirname, '../../../.env.test') })

// Increase timeout for async operations
jest.setTimeout(10000)

// Add any global test setup here
beforeAll(async () => {
  // Global setup if needed
})

afterAll(async () => {
  // Ensure we have time to clean up
  await new Promise(resolve => setTimeout(resolve, 500))
}) 