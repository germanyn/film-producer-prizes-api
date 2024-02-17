declare global {
    namespace NodeJS {
        interface ProcessEnv {
            SEED_PATH: string | undefined
            DATABASE_NAME: string | undefined
        }
    }
}

export {}
