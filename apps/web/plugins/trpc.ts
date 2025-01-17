import { client } from '../src/client'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      client: client
    }
  }
}) 