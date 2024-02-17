import { DataSource } from "typeorm";
import path from 'node:path'

export const AppDataSource = new DataSource({
    type: 'sqlite',
    database: './database/films-app',
    entities: [ path.join(__dirname, '../modules/**/models/*.ts')],
})
