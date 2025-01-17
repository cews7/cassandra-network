export interface Prediction {
  id: string
  title: string
  text: string
  timeframe: 'IMMEDIATE' | 'NEAR' | 'MEDIUM' | 'LONG'
  dueDate: string | null
  status: 'ACTIVE' | 'VALIDATED' | 'FAILED'
  userId: string
  createdAt: string
  updatedAt: string
  patternId: string | null
} 
