import { useClient } from '~/composables/useClient'
import type { Prediction } from '~/types/api/prediction.types'

export const usePredictionService = () => {
  const client = useClient()

  const listPredictions = async (): Promise<Prediction[]> => {
    try {
      return await client.predictions.list.query()
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch predictions')
    }
  }

  return {
    listPredictions,
  }
} 