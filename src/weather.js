// TODO: implement using Hono + Open Meteo API
// Context7 query target: @upstash/context7-mcp resolve-library-id open-meteo
// Expected API: https://api.open-meteo.com/v1/forecast?latitude=...&longitude=...&current=temperature_2m

/**
 * @param {{ latitude: number, longitude: number }} coords
 * @returns {Promise<{ temperature: number, unit: string }>}
 */
export async function fetchWeather(coords) {
  throw new Error('Not implemented')
}

/**
 * @param {{ temperature: number, unit: string, location: string }} data
 * @returns {string}
 */
export function formatWeather(data) {
  throw new Error('Not implemented')
}
