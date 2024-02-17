import fs from 'node:fs/promises'
import path from 'node:path'
import { Movie } from '../modules/movies/models/Movie'

const SEED_PATH = path.join('seeds/movielist.csv')

export async function seedMoviesByCsv() {
    try {
        await Movie.clear()
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

    const moviesBeingCreated = rows
        .filter(Boolean)
        .map(async row => {
            const [
                year,
                title,
                studios,
                producers,
                winner,
            ] = row.split(';')

            const movie = Movie.create({
                year: Number(year),
                title,
                studios: parseHumanizedListColumn(studios),
                producers: parseHumanizedListColumn(producers),
                winner: winner === 'yes' ? true : false,
            })
            return movie.save()
        })

    await Promise.all(moviesBeingCreated)
}

function parseHumanizedListColumn(column: string) {
    return column
        .replace(' and ', ',')
        .split(',')
        .map(item => item.trim())
}