<script setup lang="ts">
import { ref } from 'vue'
import { trpc } from '~/src/utils/trpc'

const content = ref('')
const expectedDate = ref('')
const loading = ref(false)

async function submitPrediction() {
  if (!content.value || !expectedDate.value) return
  
  loading.value = true
  try {
    await trpc.predictions.create.mutate({
      content: content.value,
      expectedDate: expectedDate.value
    })
    content.value = ''
    expectedDate.value = ''
  } catch (error) {
    console.error('Failed to submit prediction:', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h2 class="text-lg font-semibold mb-4">Submit New Prediction</h2>
    <form @submit.prevent="submitPrediction" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          What do you predict?
        </label>
        <textarea
          v-model="content"
          required
          rows="3"
          class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Describe your prediction..."
        />
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          When will this happen?
        </label>
        <input
          v-model="expectedDate"
          type="datetime-local"
          required
          class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ loading ? 'Submitting...' : 'Submit Prediction' }}
      </button>
    </form>
  </div>
</template> 