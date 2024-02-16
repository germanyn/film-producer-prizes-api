import express from 'express'

const app = express()

const PORT = 6346

app.get('', (_, res) => {
    res.send('API is running')
})

app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`)
})
