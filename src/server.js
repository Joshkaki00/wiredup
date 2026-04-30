import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { fetchWeather } from './weather.js'
import { fetchMultiCityWeather, getWeatherComparison, getWeatherStats } from './weatherComparison.js'
import { fetchWeatherProjectReadmes } from './github.js'

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
          <style>
            body { font-family: sans-serif; margin: 20px; }
            .comparison { background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 10px 0; }
            .city { padding: 10px; background: white; margin: 5px 0; border-left: 4px solid #007bff; }
          </style>
        </head>
        <body>
          <h1>Wiredup — Weather Comparison Dashboard</h1>
          <div id="weather">Loading comparison...</div>
          <div id="stats" style="margin-top: 20px;"></div>
          <script>
            async function loadData() {
              const res = await fetch('/compare');
              const data = await res.json();
              document.getElementById('weather').innerHTML = data.cities.map(c =>
                \`<div class="city">\${c.location}: \${c.temperature}\${c.unit}</div>\`
              ).join('');

              const statsRes = await fetch('/stats');
              const stats = await statsRes.json();
              document.getElementById('stats').innerHTML = \`
                <div class="comparison">
                  <h3>Stats</h3>
                  <p>Warmest: \${stats.warmest.location} (\${stats.warmest.temperature}\${stats.unit})</p>
                  <p>Coldest: \${stats.coldest.location} (\${stats.coldest.temperature}\${stats.unit})</p>
                  <p>Average: \${stats.average}\${stats.unit}</p>
                </div>
              \`;
            }
            loadData();
          </script>
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

  app.get('/compare', async (c) => {
    await fetchMultiCityWeather()
    const comparison = getWeatherComparison()
    return c.json({ cities: comparison })
  })

  app.get('/stats', (c) => {
    const stats = getWeatherStats()
    return c.json(stats || { error: 'No data yet' })
  })

  app.get('/projects', async (c) => {
    const projects = await fetchWeatherProjectReadmes()
    return c.json({ projects })
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
    const server = serve(
      { fetch: app.fetch, port },
      (info) => {
        console.log(`Server running at http://localhost:${info.port}`)
        resolve(server)
      }
    )
  })
}
