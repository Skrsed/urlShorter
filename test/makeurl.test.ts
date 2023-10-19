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

test('GET `/makeurl` empty', async () => {
    const { statusCode } = await server.inject({
        method: 'POST',
        url: '/makeurl'
    })

    expect(statusCode).toEqual(400)
})

test('GET `/makeurl` wrong url', async () => {
    const { statusCode } = await server.inject({
        method: 'POST',
        url: '/makeurl',
        body: { url: 'fullycrap' }
    })

    expect(statusCode).toEqual(400)
})

test('GET `/makeurl` wrong id (too long)', async () => {
    const { statusCode } = await server.inject({
        method: 'POST',
        url: '/makeurl',
        body: {
            url: 'https://google.com',
            id: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
        }
    })

    expect(statusCode).toEqual(400)
})

test('GET `/makeurl` wrong id (wrong format)', async () => {
    const { statusCode } = await server.inject({
        method: 'POST',
        url: '/makeurl',
        body: {
            url: 'https://google.com',
            id: 'i$#$$G$4444//%GFFvv2'
        }
    })

    expect(statusCode).toEqual(400)
})

test('GET `/makeurl` correct url', async () => {
    const res = await server.inject({
        method: 'POST',
        url: '/makeurl',
        body: { url: 'https://yandex.com/search?qert=123' }
    })

    expect(res.statusCode).toEqual(200)
})

test('GET `/makeurl` with full correct and doubled id', async () => {
    const goodRes = await server.inject({
        method: 'POST',
        url: '/makeurl',
        body: { url: 'https://google.com', id: 'sameguy' }
    })

    expect(goodRes?.statusCode).toEqual(200)

    const doubledRes = await server.inject({
        method: 'POST',
        url: '/makeurl',
        body: { url: 'https://google2.com', id: 'sameguy' }
    })

    expect(doubledRes?.statusCode).toEqual(400)
})