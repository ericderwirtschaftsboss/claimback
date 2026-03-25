#!/usr/bin/env node
/**
 * Sets the Prisma schema provider based on DATABASE_URL.
 * - "file:..." → sqlite
 * - "postgresql://..." or "postgres://..." → postgresql
 * Run before prisma generate/migrate.
 */
const fs = require('fs')
const path = require('path')

const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma')
const dbUrl = process.env.DATABASE_URL || ''

let provider = 'sqlite' // default for local dev
if (dbUrl.startsWith('postgresql://') || dbUrl.startsWith('postgres://')) {
  provider = 'postgresql'
}

console.log(`[set-db-provider] DATABASE_URL starts with: ${dbUrl.slice(0, 15)}...`)
console.log(`[set-db-provider] Setting provider to: ${provider}`)

let schema = fs.readFileSync(schemaPath, 'utf-8')
schema = schema.replace(
  /provider\s*=\s*"(sqlite|postgresql)"/,
  `provider = "${provider}"`
)
fs.writeFileSync(schemaPath, schema)
console.log('[set-db-provider] Schema updated.')
