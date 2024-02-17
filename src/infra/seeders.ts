import fs from 'node:fs/promises'
import { Movie } from '../modules/movies/models/Movie'
import { Producer } from '../modules/movies/models/Producer'
import { AppDataSource } from './database'

export async function seedMoviesByCsv() {
    const SEED_PATH = process.env.SEED_PATH
    if (!SEED_PATH) {
        throw new Error('No environment variable found for SEED_PATH, please specify a path where the MOVIES.csv file is located.')
    }

    try {
        await Movie.clear()
        await Producer.clear()
    } catch (error) {
        throw new Error("Couldn't clear movies data for seeding", {
            cause: error,
        })
    }

    let csvContent: string
    try {
        csvContent = await fs.readFile(SEED_PATH, {
            encoding: 'utf8',
            flag: 'r',
        })
    } catch(error) {
        throw new Error("Couldn't read seed file", {
            cause: error,
        })
    }

    const [
        _header,
        ...rows
    ] = csvContent.split('\n')

    const producers = new Map<string, Producer>()

    const movies = rows
        .filter(Boolean)
        .map(row => {
            const [
                year,
                title,
                studios,
                producersNames,
                winner,
            ] = row.split(';')
            
            const movieProducers = parseHumanizedListColumn(producersNames)
                .map(name => {
                    const producer = producers.get(name) || Producer.create({ name })

                    producers.set(name, producer)

                    return producer
                })

            const movie = Movie.create({
                year: Number(year),
                title,
                studios: parseHumanizedListColumn(studios),
                winner: winner === 'yes' ? true : false,
                producers: movieProducers,
            })

            return movie
        })

    await AppDataSource.manager.transaction(async (transactionManager) => {
        const savedProducers = await transactionManager.save(Array.from(producers.values()))
        movies.forEach(movie => {
            movie.producers = movie.producers
                .map(producer => savedProducers.find(saved => saved.name === producer.name)!)
        })
        await transactionManager.save(movies)
    })
}

function parseHumanizedListColumn(column: string) {
    return column
        .replace(' and ', ',')
        .split(',')
        .map(item => item.trim())
}