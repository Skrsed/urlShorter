import mongoose from 'mongoose'
import { app } from './app'
import pino from 'pino'
import pretty from 'pino-pretty'

const logger = pino(pretty())

mongoose.connect('mongodb://root:example@localhost:27017')

app().listen({ port: 8088 }, (err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    logger.info(`Server listening at ${address}`)
})