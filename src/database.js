import Database from 'better-sqlite3'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.join(__dirname, '..', 'weather.db')

let db = null

export function initDatabase() {
  db = new Database(dbPath)
  db.exec(`
    CREATE TABLE IF NOT EXISTS weather_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      location TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      temperature REAL NOT NULL,
      unit TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      recorded_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `)
  return db
}

export function getDatabase() {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.')
  }
  return db
}

export function recordWeather(location, latitude, longitude, temperature, unit) {
  const db = getDatabase()
  const stmt = db.prepare(`
    INSERT INTO weather_history (location, latitude, longitude, temperature, unit, timestamp)
    VALUES (?, ?, ?, ?, ?, ?)
  `)
  return stmt.run(location, latitude, longitude, temperature, unit, new Date().toISOString())
}

export function getWeatherHistory(location) {
  const db = getDatabase()
  const stmt = db.prepare(`
    SELECT * FROM weather_history
    WHERE location = ?
    ORDER BY recorded_at DESC
    LIMIT 10
  `)
  return stmt.all(location)
}

export function getAllLocations() {
  const db = getDatabase()
  const stmt = db.prepare(`
    SELECT DISTINCT location, latitude, longitude
    FROM weather_history
    ORDER BY location
  `)
  return stmt.all()
}

export function getLatestByLocation() {
  const db = getDatabase()
  const stmt = db.prepare(`
    SELECT location, temperature, unit, recorded_at
    FROM weather_history
    WHERE recorded_at = (
      SELECT MAX(recorded_at)
      FROM weather_history wh2
      WHERE wh2.location = weather_history.location
    )
    ORDER BY location
  `)
  return stmt.all()
}
