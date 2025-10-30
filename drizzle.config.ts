import { config } from 'dotenv'
import { defineConfig } from 'drizzle-kit'

config()

interface PostgresJsDatabaseConfig {
  url: string
}

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schemas/index.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  } as PostgresJsDatabaseConfig,
})
