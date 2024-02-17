import { Movie } from "../movies/models/Movie"

export async function getShortestAndLongestProducerWinIntervals() {
    // only awarded movies
    const movies = await Movie.findBy({
        winner: true,
    })

    const moviesByProducer = new Map<string, Movie[]>()

    movies.forEach(movie => {
        movie.producers.forEach(producer => {
            const producerMovies = moviesByProducer.get(producer) || []
            moviesByProducer.set(producer, [
                ...producerMovies,
                movie,
            ])
        })
    })

    const producersIntervals = Array
        .from(moviesByProducer.entries())
        .flatMap(([producer, movies]) => {
            return calculateNeighborMoviesInterval(movies)
                .map(moviesInterval => {
                    return {
                        ...moviesInterval,
                        producer,
                    }
                })
        })

    const sortedIntervals = producersIntervals.toSorted((producerA, producerB) => {
        return producerA.interval - producerB.interval
    })

    const shortestProducerInterval = sortedIntervals.at(0)
    const largestProducerInterval = sortedIntervals.at(-1)

    return {
        min: sortedIntervals.filter(producer => producer.interval === shortestProducerInterval?.interval),
        max: sortedIntervals.filter(producer => producer.interval === largestProducerInterval?.interval),
    }
}

export interface ProducerIntervalInformation {
    producer: string
    interval: number
    previousWin: number
    followingWin: number
}

function calculateNeighborMoviesInterval(movies: Movie[]): MovieInterval[] {
    return movies
        .toSorted((movieA, movieB) => movieA.year - movieB.year)
        .reduce<MovieInterval[]>((intervals, movie, index, sortedMovies) => {
            // skips first movie
            if (!index) {
                return intervals
            }

            const neighborMovie = sortedMovies[index -1]

            const movieInterval: MovieInterval = {
                interval: Math.abs(neighborMovie.year - movie.year),
                previousWin: Math.min(neighborMovie.year, movie.year),
                followingWin: Math.max(neighborMovie.year, movie.year),
            }

            return [
                ...intervals,
                movieInterval,
            ]
        }, [])
}

interface MovieInterval {
    interval: number
    previousWin: number
    followingWin: number
}

function isNotEmpty<T>(value: T | null | undefined): value is T {
    return !!value
}