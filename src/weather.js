/**
 * @param {{ latitude: number, longitude: number }} coords
 * @returns {Promise<{ temperature: number, unit: string }>}
 */
export async function fetchWeather(coords) {
  if (!Number.isFinite(coords.latitude) || !Number.isFinite(coords.longitude) ||
      coords.latitude < -90 || coords.latitude > 90 ||
      coords.longitude < -180 || coords.longitude > 180) {
    throw new Error('Invalid coordinates')
  }

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current=temperature_2m`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Weather API error: ${res.status}`)

  const data = await res.json()
  return {
    temperature: data.current.temperature_2m,
    unit: '°C'
  }
}

/**
 * @param {{ temperature: number, unit: string, location: string }} data
 * @returns {string}
 */
export function formatWeather(data) {
  return `${data.location}: ${data.temperature}${data.unit}`
}
