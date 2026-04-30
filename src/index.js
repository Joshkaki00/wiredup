import { start } from './server.js'

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000

await start(PORT)
console.log(`Wiredup running at http://localhost:${PORT}`)
