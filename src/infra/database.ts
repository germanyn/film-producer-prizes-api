import { DataSource } from "typeorm";
import path from 'node:path'

const DATABASE_NAME = process.env.DATABASE_NAME
if (!DATABASE_NAME) {
    throw new Error('No environment variable found for DATABASE_NAME, specify for correct database connection.')
}

export const AppDataSource = new DataSource({
    type: 'sqlite',
    database: DATABASE_NAME,
    entities: [ path.join(__dirname, '../modules/**/models/*.ts')],
})
