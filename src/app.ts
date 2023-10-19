import fastify, { FastifyInstance } from 'fastify'
import shorterRoutes from './api'

export const app = (): FastifyInstance => {
    const server = fastify()

    server.register(shorterRoutes)

    return server
}