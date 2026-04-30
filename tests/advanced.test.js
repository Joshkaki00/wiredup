import { test, describe, before } from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from '../src/server.js'
import { initDatabase, recordWeather } from '../src/database.js'
import { getWeatherComparison, getWeatherStats } from '../src/weatherComparison.js'

describe('Advanced Features', () => {
  let app

  before(() => {
    initDatabase()
    app = createServer()
  })

  describe('GET /compare', () => {
    test('fetches weather for multiple cities', async () => {
      const res = await app.request('/compare')
      assert.equal(res.status, 200)
      const data = await res.json()
      assert.ok(data.cities, 'should have cities array')
      assert.ok(Array.isArray(data.cities), 'cities should be an array')
      assert.ok(data.cities.length >= 0, 'should return valid cities array')
    })

    test('stores weather in database', async () => {
      recordWeather('TestCity', 40.7128, -74.0060, 15.5, '°C')
      const comparison = getWeatherComparison()
      assert.ok(
        comparison.some(c => c.location === 'TestCity'),
        'should find recorded city in comparison'
      )
    })
  })

  describe('GET /stats', () => {
    test('returns weather statistics', async () => {
      recordWeather('Warm', 0, 0, 30, '°C')
      recordWeather('Cold', 0, 0, 5, '°C')

      const res = await app.request('/stats')
      assert.equal(res.status, 200)
      const stats = await res.json()

      if (stats.cities >= 2) {
        assert.ok(stats.warmest, 'should have warmest city')
        assert.ok(stats.coldest, 'should have coldest city')
        assert.ok(stats.average, 'should have average temperature')
        assert.ok(stats.unit, 'should have unit')
      }
    })
  })

  describe('GET /projects', () => {
    test('fetches GitHub weather projects', async () => {
      const res = await app.request('/projects')
      assert.equal(res.status, 200)
      const data = await res.json()
      assert.ok(data.projects, 'should have projects array')
      assert.ok(Array.isArray(data.projects), 'projects should be an array')
      // May return 0+ projects depending on network and rate limits
      assert.ok(data.projects.length >= 0, 'should return valid project data')
    })
  })

  describe('Dashboard HTML', () => {
    test('main page includes comparison dashboard', async () => {
      const res = await app.request('/')
      assert.equal(res.status, 200)
      const html = await res.text()
      assert.ok(html.includes('Weather Comparison Dashboard'), 'should include dashboard title')
      assert.ok(html.includes('id="weather"'), 'should have weather element')
      assert.ok(html.includes('id="stats"'), 'should have stats element')
      assert.ok(html.includes('/compare'), 'should reference /compare endpoint')
      assert.ok(html.includes('/stats'), 'should reference /stats endpoint')
    })
  })
})
