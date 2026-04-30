import { fetchWeather } from './weather.js'
import { recordWeather, getLatestByLocation } from './database.js'

// Multi-city weather with historical tracking
// Demonstrates advanced integration: Open Meteo API + SQLite persistence + Context7 live docs

const CITIES = [
  { name: 'San Francisco', latitude: 37.7749, longitude: -122.4194 },
  { name: 'London', latitude: 51.5074, longitude: -0.1278 },
  { name: 'Tokyo', latitude: 35.6762, longitude: 139.6503 }
]

export async function fetchMultiCityWeather() {
  const results = []

  for (const city of CITIES) {
    try {
      const weather = await fetchWeather({
        latitude: city.latitude,
        longitude: city.longitude
      })
      recordWeather(
        city.name,
        city.latitude,
        city.longitude,
        weather.temperature,
        weather.unit
      )
      results.push({
        location: city.name,
        temperature: weather.temperature,
        unit: weather.unit,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error(`Failed to fetch weather for ${city.name}:`, error.message)
    }
  }

  return results
}

export function getWeatherComparison() {
  const latest = getLatestByLocation()
  return latest.map(record => ({
    location: record.location,
    temperature: record.temperature,
    unit: record.unit,
    recordedAt: record.recorded_at
  }))
}

export function getWeatherStats() {
  const latest = getLatestByLocation()
  if (latest.length === 0) return null

  const temperatures = latest.map(r => r.temperature)
  const min = Math.min(...temperatures)
  const max = Math.max(...temperatures)
  const avg = temperatures.reduce((a, b) => a + b, 0) / temperatures.length

  return {
    cities: latest.length,
    coldest: {
      location: latest.find(r => r.temperature === min).location,
      temperature: min
    },
    warmest: {
      location: latest.find(r => r.temperature === max).location,
      temperature: max
    },
    average: avg.toFixed(1),
    unit: latest[0]?.unit || '°C'
  }
}
