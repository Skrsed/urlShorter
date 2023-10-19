import mongoose from 'mongoose'
import { app } from './app'
import pino from 'pino'
import pretty from 'pino-pretty'
import {appConfig} from './utils'
import dotenv from 'dotenv'

dotenv.config({path: `${__dirname}/../.env`})

const {
    appPort,
    mongoPort,
    mongoUser,
    mongoPassword
} = appConfig()

const logger = pino(pretty())

mongoose.connect(`mongodb://${mongoUser}:${mongoPassword}@localhost:${mongoPort}`)

app().listen({ port: Number(appPort) }, (err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    logger.info(`Server listening at ${address}`)
})