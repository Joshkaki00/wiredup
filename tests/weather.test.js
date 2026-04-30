import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { fetchWeather, formatWeather } from '../src/weather.js'

describe('fetchWeather', () => {
  test('returns an object with temperature and units', async () => {
    const result = await fetchWeather({ latitude: 37.77, longitude: -122.42 })
    assert.ok(typeof result === 'object', 'result should be an object')
    assert.ok('temperature' in result, 'result should have temperature')
    assert.ok('unit' in result, 'result should have unit')
    assert.ok(typeof result.temperature === 'number', 'temperature should be a number')
  })

  test('accepts a location object and returns live data', async () => {
    const result = await fetchWeather({ latitude: 51.51, longitude: -0.13 }) // London
    assert.ok(result.temperature >= -60 && result.temperature <= 60,
      'temperature should be a plausible value in Celsius')
  })

  test('throws on invalid coordinates', async () => {
    await assert.rejects(
      () => fetchWeather({ latitude: 999, longitude: 999 }),
      { name: 'Error' }
    )
  })
})

describe('formatWeather', () => {
  test('formats weather data into a display string', () => {
    const formatted = formatWeather({ temperature: 18.5, unit: '°C', location: 'San Francisco' })
    assert.ok(typeof formatted === 'string', 'should return a string')
    assert.ok(formatted.includes('18.5'), 'should include the temperature')
    assert.ok(formatted.includes('San Francisco'), 'should include the location')
  })

  test('handles negative temperatures', () => {
    const formatted = formatWeather({ temperature: -3.2, unit: '°C', location: 'Oslo' })
    assert.ok(formatted.includes('-3.2'), 'should include negative temperature')
  })
})
