import request from 'supertest'
import { setupApplication } from '../../infra/setup'
import { Express } from 'express'
import { AppDataSource } from '../../infra/database'

let app!: Express

describe('Movies Module', () => {
    beforeAll(async () => {
        app = await setupApplication()
    })

    describe('Producer Intervals Summary', () => {
        it('should have a reachable route', async () => {
            await request(app)
                .options('/producer-intervals-summary')
                .expect(200)
        })

        it('should return correct values', async () => {
            const response = await request(app)
                .get('/producer-intervals-summary')
                .expect('Content-Type', /json/)
                .expect(200)
            
            expect(response.body).toStrictEqual(SAMPLE_RESPONSE_RESULT)
        })
    })

    afterAll(async () => {
        await AppDataSource.destroy()
    })
})

const SAMPLE_RESPONSE_RESULT = {
    "min": [
        {
            "interval": 1,
            "previousWin": 1990,
            "followingWin": 1991,
            "producer": "Joel Silver"
        }
    ],
    "max": [
        {
            "interval": 13,
            "previousWin": 2002,
            "followingWin": 2015,
            "producer": "Matthew Vaughn"
        }
    ]
}
