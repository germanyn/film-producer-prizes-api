import { setupApplication } from "./infra/setup"

const PORT = 6346

async function runApplication() {
    const app = await setupApplication()

    app.listen(PORT, () => {
        console.log(`Listening on http://localhost:${PORT}`)
    })
}

runApplication()
