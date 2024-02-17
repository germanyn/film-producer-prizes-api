import { Movie } from "../movies/models/Movie"
import { Producer } from "../movies/models/Producer";
import { type ProducerIntervalInformation, getShortestAndLongestProducerWinIntervals } from "./get-shortest-and-longest-producer-win-intervals";

jest.mock("../movies/models/Movie")

const mockedProducer = jest.mocked(Producer)

describe('getShortestAndLongestProducerWinIntervals', () => {
    it('works when has no movies', async () => {
        jest.spyOn(mockedProducer, 'find').mockResolvedValueOnce([])
        
        const result = await getShortestAndLongestProducerWinIntervals()

        expect(result).toMatchObject({
            min: [],
            max: [],
        })
    })

    it('returns a producer for min and max intervals', async () => {
        const SAMPLE_PRODUCERS: Producer[] = [
            buildSampleProducer({
                name: 'Steven Spielberg',
                movies: [
                    buildSampleWinnerMovie({
                        title: 'E.T.',
                        year: 1982
                    }),
                    buildSampleWinnerMovie({
                        title: 'Jaws',
                        year: 1975,
                    }),
                ]
            })
        ]

        const stevenInterval: ProducerIntervalInformation = {
            producer: 'Steven Spielberg',
            followingWin: 1982,
            previousWin: 1975,
            interval: 7,
        }

        jest.spyOn(mockedProducer, 'find').mockResolvedValueOnce(SAMPLE_PRODUCERS)
        
        const result = await getShortestAndLongestProducerWinIntervals()

        expect(result).toMatchObject({
            min: [stevenInterval],
            max: [stevenInterval],
        })
    })

    it('returns correct producers for min and max', async () => {
        const SAMPLE_PRODUCERS: Producer[] = [
            buildSampleProducer({
                name: 'Steven Spielberg',
                movies: [
                    buildSampleWinnerMovie({
                        title: 'E.T.',
                        year: 1982
                    }),
                    buildSampleWinnerMovie({
                        title: 'Jaws',
                        year: 1975,
                    }),
                ]
            }),
            buildSampleProducer({
                name: 'George Lucas',
                movies: [
                    buildSampleWinnerMovie({
                        title: 'Star Wars: Episode IV - A New Hope',
                        year: 1977,
                    }),
                    buildSampleWinnerMovie({
                        title: 'Raiders of the Lost Ark',
                        year: 1981,
                    }),
                ]
            }),
        ]

        const stevenInterval: ProducerIntervalInformation = {
            producer: 'Steven Spielberg',
            followingWin: 1982,
            previousWin: 1975,
            interval: 7,
        }

        const georgeInterval: ProducerIntervalInformation = {
            producer: 'George Lucas',
            followingWin: 1981,
            previousWin: 1977,
            interval: 4,
        }

        jest.spyOn(mockedProducer, 'find').mockResolvedValueOnce(SAMPLE_PRODUCERS)
        
        const result = await getShortestAndLongestProducerWinIntervals()

        expect(result).toMatchObject({
            min: [georgeInterval],
            max: [stevenInterval],
        })
    })

    it('repeat producer with same interval', async () => {
        const SAMPLE_PRODUCERS: Producer[] = [
            buildSampleProducer({
                name: 'Steven Spielberg',
                movies: [
                    buildSampleWinnerMovie({
                        title: 'E.T.',
                        year: 1982
                    }),
                    buildSampleWinnerMovie({
                        title: 'Jaws',
                        year: 1975,
                    }),
                ]
            }),
            buildSampleProducer({
                name: 'George Lucas',
                movies: [
                    buildSampleWinnerMovie({
                        title: 'Star Wars: Episode IV - A New Hope',
                        year: 1970,
                    }),
                    buildSampleWinnerMovie({
                        title: 'Raiders of the Lost Ark',
                        year: 1977,
                    }),
                ]
            }),
        ]

        const stevenInterval: ProducerIntervalInformation = {
            producer: 'Steven Spielberg',
            followingWin: 1982,
            previousWin: 1975,
            interval: 7,
        }

        const georgeInterval: ProducerIntervalInformation = {
            producer: 'George Lucas',
            followingWin: 1977,
            previousWin: 1970,
            interval: 7,
        }

        jest.spyOn(mockedProducer, 'find').mockResolvedValueOnce(SAMPLE_PRODUCERS)
        
        const result = await getShortestAndLongestProducerWinIntervals()

        expect(result).toMatchObject({
            min: expect.arrayContaining([georgeInterval, stevenInterval]),
            max: expect.arrayContaining([georgeInterval, stevenInterval]),
        })
    })
})


function buildSampleProducer(producer: Partial<Producer>): Producer {
    // @ts-expect-error: simpler for testing
    return {
        name: 'Producer Name',
        ...producer,
    }
}

function buildSampleWinnerMovie(movie: Partial<Movie>): Movie {
    // @ts-expect-error: simpler for testing
    return {
        title: 'Movie Name',
        year: 1990,
        winner: true,
        ...movie,
    }
}