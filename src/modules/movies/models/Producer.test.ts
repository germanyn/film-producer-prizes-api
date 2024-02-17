import { AppDataSource } from "../../../infra/database"
import { seedMoviesByCsv } from "../../../infra/seeders"
import { Producer } from "./Producer"

describe('Producer', () => {
    beforeAll(async () => {
        await AppDataSource.initialize()
    })

    afterAll(async () => {
        await AppDataSource.destroy()
    })

    beforeEach(async () => {
        await AppDataSource.synchronize(true)
    })

    describe('findConsecutivePrizes' , () => {
        it('return correct value for shortest prize', async () => {
            await seedMoviesByCsv()
            
            const result = await Producer.findShortestConsecutivePrizes()

            expect(result).toMatchObject([
                {
                    producer: "Joel Silver",
                    previousWin: 1990,
                    followingWin: 1991,
                    interval: 1
                },
            ])
        })

        it('return correct value for longest prize', async () => {    
            await seedMoviesByCsv()
            
            const result = await Producer.findLongestConsecutivePrizes()

            expect(result).toMatchObject([
                {
                    producer: "Matthew Vaughn",
                    previousWin: 2002,
                    followingWin: 2015,
                    interval: 13,
                },
            ])
        })
    })
})
