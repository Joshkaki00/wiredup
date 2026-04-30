import { Hono } from 'hono'
import { fetchWeather } from './weather.js'

/**
 * @returns {import('hono').Hono}
 */
export function createServer() {
  const app = new Hono()

  app.get('/', (c) => {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Wiredup</title>
        </head>
        <body>
          <h1>Wiredup</h1>
          <div id="weather">Loading weather...</div>
        </body>
      </html>
    `
    return c.html(html)
  })

  app.get('/data', async (c) => {
    const weather = await fetchWeather({ latitude: 37.7749, longitude: -122.4194 })
    const data = {
      temperature: weather.temperature,
      unit: weather.unit,
      location: 'San Francisco',
      timestamp: new Date().toISOString()
    }
    return c.json(data)
  })

  app.get('/health', (c) => {
    return c.json({ status: 'ok' })
  })

  return app
}

/**
 * Start the server on the given port.
 * @param {number} port
 */
export async function start(port = 3000) {
  const app = createServer()
  return new Promise((resolve) => {
    const server = app.serve({ port, fetch: app.fetch })
    console.log(`Server running on port ${port}`)
    resolve(server)
  })
}
