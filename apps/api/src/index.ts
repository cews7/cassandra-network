import { buildApp } from "./app"

const start = async () => {
  try {
    const server = await buildApp()
    const port = process.env.PORT ? parseInt(process.env.PORT) : 3001
    const host = process.env.HOST ? process.env.HOST : '0.0.0.0'

    await server.listen({ host, port })
    console.log(`Server listening on ${host}:${port}`)
  } catch (err) {
    console.error('Error starting server:', err)
    process.exit(1)
  }
}

start() 