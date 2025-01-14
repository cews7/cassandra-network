import { FastifyInstance } from 'fastify'
import { createTestServer, closeTestServer, cleanDatabase } from '../helpers'
import { InviteService } from '../../services/inviteService'
import { SignupService } from '../../services/signupService'

// Mock InviteService
const mockInviteService = {
  validateInvite: jest.fn().mockResolvedValue(true),
  markInviteAsUsed: jest.fn().mockResolvedValue(true),
  createInvite: jest.fn().mockResolvedValue({ code: 'test-invite-code' })
}

// Mock Supabase response
const mockSupabaseUser = {
  id: 'mock-supabase-id',
  email: 'test@example.com',
}

// Mock Supabase client
const mockSupabaseClient = {
  auth: {
    signUp: jest.fn().mockResolvedValue({
      data: { 
        user: mockSupabaseUser
      },
      error: null
    }),
    signOut: jest.fn().mockResolvedValue(true)
  }
}

// Mock SignupService to use our mocks
jest.mock('../../services/signupService', () => {
  return {
    SignupService: jest.fn().mockImplementation(() => {
      return new (jest.requireActual('../../services/signupService').SignupService)(
        mockSupabaseClient,
        mockInviteService
      )
    })
  }
})

describe('Signup Routes', () => {
  let app: FastifyInstance
  let testEmail: string

  beforeEach(async () => {
    app = await createTestServer()
    app.supabase = mockSupabaseClient as any
    // Generate unique email for each test
    testEmail = `test-${Date.now()}@example.com`
    jest.clearAllMocks()
  })

  afterEach(async () => {
    await closeTestServer(app)
    await cleanDatabase()
  })

  it('should create a new user with valid invite code', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/signup',
      payload: {
        email: testEmail,
        password: 'password123',
        inviteCode: 'test-invite-code'
      }
    })


    expect(response.statusCode).toBe(201)
    expect(JSON.parse(response.payload)).toHaveProperty('userId')
    expect(mockSupabaseClient.auth.signUp).toHaveBeenCalledWith({
      email: testEmail,
      password: 'password123'
    })
  })

  it('should reject invalid invite codes', async () => {
    // Override the mock for this test
    mockInviteService.validateInvite.mockRejectedValueOnce(new Error('Invalid invite'))
    
    const response = await app.inject({
      method: 'POST',
      url: '/signup',
      payload: {
        email: testEmail,
        password: 'password123',
        inviteCode: 'invalid-code'
      }
    })

    expect(response.statusCode).toBe(400)
    expect(JSON.parse(response.payload)).toHaveProperty('error', 'Invalid invite')
  })
})