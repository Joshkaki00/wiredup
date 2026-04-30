import { start } from './server.js'
import { initDatabase } from './database.js'

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000

initDatabase()
await start(PORT)
