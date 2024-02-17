import { Router } from 'express'
import { getShortestAndLongestProducerWinIntervals } from './services/get-shortest-and-longest-producer-win-intervals'

const router = Router()

router.get('/producer-intervals-summary', async (_, res) => {
    const producersByInterval = await getShortestAndLongestProducerWinIntervals()
    res.send(producersByInterval)
})

export {
    router as movieRouter
}
