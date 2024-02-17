import { Producer } from "../models/Producer"

export async function getShortestAndLongestProducerWinIntervalsBySql() {
    const [
        min,
        max,
    ] = await Promise.all([
        Producer.findShortestConsecutivePrizes(),
        Producer.findLongestConsecutivePrizes(),
    ])
    return {
        min,
        max,
    }
}