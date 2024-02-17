import 'reflect-metadata'
import express from 'express'
import { AppDataSource } from './database'
import { seedMoviesByCsv } from './seeders'
import { movieRouter } from '../modules/movies/routes'

export async function setupApplication() {
    await AppDataSource.initialize()

    await AppDataSource.synchronize(true)

    await seedMoviesByCsv()

    const application = express()
    
    application.get('', (_, res) => {
        res.send('API is running')
    })

    application.use(movieRouter)

    return application
}
