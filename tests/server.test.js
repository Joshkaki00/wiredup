import { test, describe, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from '../src/server.js'

describe('GET /data', () => {
  let app

  before(() => {
    app = createServer()
  })

  test('responds with 200', async () => {
    const res = await app.request('/data')
    assert.equal(res.status, 200)
  })

  test('responds with JSON content-type', async () => {
    const res = await app.request('/data')
    assert.ok(
      res.headers.get('content-type')?.includes('application/json'),
      'should return JSON'
    )
  })

  test('response body has expected shape', async () => {
    const res = await app.request('/data')
    const body = await res.json()
    assert.ok('temperature' in body, 'body should have temperature')
    assert.ok('unit' in body, 'body should have unit')
    assert.ok('location' in body, 'body should have location')
    assert.ok('timestamp' in body, 'body should have timestamp')
  })

  test('timestamp is a valid ISO string', async () => {
    const res = await app.request('/data')
    const { timestamp } = await res.json()
    assert.doesNotThrow(() => new Date(timestamp), 'timestamp should be parseable')
    assert.ok(!isNaN(new Date(timestamp).getTime()), 'timestamp should be a valid date')
  })
})

describe('GET /', () => {
  let app

  before(() => {
    app = createServer()
  })

  test('responds with 200', async () => {
    const res = await app.request('/')
    assert.equal(res.status, 200)
  })

  test('responds with HTML content-type', async () => {
    const res = await app.request('/')
    assert.ok(
      res.headers.get('content-type')?.includes('text/html'),
      'should return HTML'
    )
  })

  test('HTML contains the app title', async () => {
    const res = await app.request('/')
    const html = await res.text()
    assert.ok(html.includes('Wiredup'), 'HTML should include app name')
  })

  test('HTML contains a data container element', async () => {
    const res = await app.request('/')
    const html = await res.text()
    assert.ok(
      html.includes('id="weather"') || html.includes("id='weather'"),
      'HTML should have a #weather element'
    )
  })
})

describe('GET /health', () => {
  let app

  before(() => {
    app = createServer()
  })

  test('returns 200 with ok status', async () => {
    const res = await app.request('/health')
    assert.equal(res.status, 200)
    const body = await res.json()
    assert.equal(body.status, 'ok')
  })
})
