<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useNuxtApp } from '#app'
import type { Prediction } from '~/types/api/prediction.types'

const route = useRoute()
const prediction = ref<Prediction | null>(null)
const loading = ref(true)
const { $trpc } = useNuxtApp()

onMounted(async () => {
  try {
    prediction.value = await $trpc.predictions.byId.query(route.params.id as string)
  } catch (error) {
    console.error('Failed to fetch prediction:', error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="container mx-auto py-8 px-4">
    <div v-if="loading" class="text-center">
      Loading prediction...
    </div>
    
    <div v-else-if="!prediction" class="text-center text-red-600">
      Prediction not found
    </div>
    
    <div v-else class="max-w-2xl mx-auto">
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex justify-between items-start mb-4">
          <h1 class="text-2xl font-bold">Prediction Details</h1>
          <span 
            class="px-3 py-1 rounded-full text-sm"
            :class="{
              'bg-yellow-100 text-yellow-800': prediction.status === 'ACTIVE',
              'bg-green-100 text-green-800': prediction.status === 'VALIDATED',
              'bg-red-100 text-red-800': prediction.status === 'FAILED'
            }"
          >
            {{ prediction.status }}
          </span>
        </div>
        
        <div class="space-y-4">
          <div>
            <h2 class="text-lg font-medium mb-2">Content</h2>
            <p class="text-gray-700">{{ prediction.text }}</p>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <h2 class="text-sm font-medium text-gray-500">Expected Date</h2>
              <p>{{ prediction.dueDate ? new Date(prediction.dueDate).toLocaleDateString() : 'Not set' }}</p>
            </div>
            <div>
              <h2 class="text-sm font-medium text-gray-500">Created At</h2>
              <p>{{ prediction.createdAt ? new Date(prediction.createdAt).toLocaleDateString() : 'Not available' }}</p>
            </div>
          </div>
        </div>
        
        <div class="mt-6">
          <NuxtLink 
            to="/" 
            class="text-blue-600 hover:text-blue-800"
          >
            ← Back to Predictions
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>