import request from 'supertest'
import { setupApplication } from '../../infra/setup'
import { Express } from 'express'
import { AppDataSource } from '../../infra/database'

let app!: Express

describe('Application', () => {
    beforeAll(async () => {
        app = await setupApplication()
    })

    it('application is running', async () => {
        const response = await request(app)
            .get('')
            .expect(200)
        
        expect(response.text).toBe('API is running')
    })

    afterAll(async () => {
        await AppDataSource.destroy()
    })
})