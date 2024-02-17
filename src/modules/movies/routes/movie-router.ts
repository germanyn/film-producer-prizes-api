import { Router } from 'express'
import { getShortestAndLongestProducerWinIntervals } from '../services/get-shortest-and-longest-producer-win-intervals'
import { getShortestAndLongestProducerWinIntervalsBySql } from '../services/get-shortest-and-longest-producer-win-intervals-by-sql'

const router = Router()

router.get('/producer-intervals-summary', async (_, res) => {
    const producersByInterval = await getShortestAndLongestProducerWinIntervals()
    res.send(producersByInterval)
})

router.get('/v2/producer-intervals-summary', async (_, res) => {
    const producersByInterval = await getShortestAndLongestProducerWinIntervalsBySql()
    
    res.send(producersByInterval)
})

export {
    router as movieRouter
}
