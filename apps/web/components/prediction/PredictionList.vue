<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Prediction } from '~/types/api/prediction.types'
import PredictionCard from './PredictionCard.vue'
import { usePredictionService } from '~/services/predictionService'

const predictions = ref<Prediction[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const predictionService = usePredictionService()

onMounted(async () => {
  try {
    predictions.value = await predictionService.listPredictions()
  } catch (err: any) {
    console.error('Failed to fetch predictions:', err)
    error.value = err.message
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div>
    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-2 text-gray-600">Loading predictions...</p>
    </div>
    
    <div v-else-if="error" class="bg-red-50 text-red-800 p-4 rounded-lg">
      Error loading predictions: {{ error }}
    </div>
    
    <div v-else>
      <div class="mb-4 flex justify-between items-center">
        <h2 class="text-lg font-semibold text-gray-900">Recent Predictions</h2>
        <span class="text-sm text-gray-500">{{ predictions.length }} total</span>
      </div>
      
      <div class="space-y-4">
        <PredictionCard 
          v-for="prediction in predictions" 
          :key="prediction.id" 
          :prediction="prediction"
        />
      </div>
      
      <div v-if="predictions.length === 0" class="text-center py-8">
        <p class="text-gray-500">No predictions yet. Be the first to make one!</p>
      </div>
    </div>
  </div>
</template> 