import { test, expect } from '@playwright/test'
import { createServer } from '../src/server.js'
import { serve } from '@hono/node-server'

let server
let port = 3000

test.beforeAll(async () => {
  const app = createServer()
  server = serve(
    { fetch: app.fetch, port },
    (info) => {
      port = info.port
    }
  )
  // Give server a moment to start
  await new Promise(resolve => setTimeout(resolve, 100))
})

test.afterAll(async () => {
  if (server) {
    server.close()
  }
})

test('page has title "Wiredup"', async ({ page }) => {
  await page.goto(`http://localhost:${port}/`)
  await expect(page).toHaveTitle('Wiredup')
})

test('weather element exists and has content', async ({ page }) => {
  await page.goto(`http://localhost:${port}/`)
  const weatherEl = page.locator('#weather')
  await expect(weatherEl).toBeVisible()
  const text = await weatherEl.textContent()
  expect(text).toBeTruthy()
  expect(text?.length).toBeGreaterThan(0)
})

test('/data endpoint returns valid JSON', async ({ page }) => {
  const response = await page.request.get(`http://localhost:${port}/data`)
  expect(response.status()).toBe(200)
  const data = await response.json()
  expect(data).toHaveProperty('temperature')
  expect(data).toHaveProperty('unit')
  expect(data).toHaveProperty('location')
  expect(data).toHaveProperty('timestamp')
})
