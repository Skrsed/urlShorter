import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { app } from '../src/app'
import { Shorter } from '../src/model'
import { appConfig } from '../src/utils'


dotenv.config({path: `${__dirname}/../.env`})
const {
    mongoTestPort,
    mongoUser,
    mongoPassword
} = appConfig()
const server = app()

beforeAll(async() => {
    await server.ready(),
    await mongoose.connect(`mongodb://${mongoUser}:${mongoPassword}@localhost:${mongoTestPort}`)
    await Shorter.collection.drop()
})

afterAll(async() => {
    await server.close()
    await mongoose.connection.close()
})

test('GET `/:id` wrong url', async () => {
    const { statusCode } = await server.inject({
        method: 'GET',
        url: '/#########'
    })

    expect(statusCode).toEqual(404)
})

test('GET `/:id` correct url', async () => {
    const redirectTo = 'https://google.com'

    const { payload } = await server.inject({
        method: 'POST',
        url: '/makeurl',
        body: { url: redirectTo, id: 'anything' }
    })

    const { url } = JSON.parse(payload)
    const relativeUrl = url.match(/[^/]*(?=$)/i).shift()

    const { headers: { location } } = await server.inject({
        method: 'GET',
        url: relativeUrl
    })

    expect(location).toEqual(redirectTo)
})

test('GET `/:id` correct url without redirect', async () => {
    const { payload } = await server.inject({
        method: 'POST',
        url: '/makeurl',
        body: { url: 'https://google.com', id: 'nothingSpecial' }
    })

    const { url } = JSON.parse(payload)
    const relativeUrl = url.match(/[^/]*(?=$)/i).shift()

    const { statusCode } = await server.inject({
        method: 'GET',
        url: relativeUrl,
        query: { redirect: 'false' }
    })

    expect(statusCode).toEqual(200)
})