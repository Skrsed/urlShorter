import { app } from '../src/app'
import mongoose from 'mongoose'
import { Shorter } from '../src/model'

const server = app()

beforeAll(async() => {
    await server.ready(),
    await mongoose.connect('mongodb://root:example@localhost:27017')
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
    const relativeUrl = url.match(/[^\/]*(?=$)/i).shift()

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
    const relativeUrl = url.match(/[^\/]*(?=$)/i).shift()

    const { statusCode } = await server.inject({
        method: 'GET',
        url: relativeUrl,
        query: { redirect: 'false' }
    })

    expect(statusCode).toEqual(200)
  })