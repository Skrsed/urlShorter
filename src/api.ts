import fp from 'fastify-plugin'
import { FastifyInstance } from 'fastify'
import { nanoid } from 'nanoid'
import { Shorter } from './model'
import { IdPayload, UrlPayload, HttpError } from './types'
import { defaultUrlLength, checkURL, maxLength } from './utils'

type ByID = {
    Querystring: { redirect: string },
    Params: IdPayload,
    Reply: UrlPayload | HttpError
}

type MakeUrl = {
    Body: UrlPayload & IdPayload,
    Reply: UrlPayload | HttpError
}

const ShorterRoutes = async(server: FastifyInstance) => {
    server.get<ByID>(
        '/:id',
        async ({ query: { redirect }, params: { id } }, reply) => {
            const shorter = await Shorter
                .where({ id })
                .findOne()

            if (!shorter) {
                return reply.status(404).send({
                    err: 'URL isn\'t found'
                })
            }

            if (redirect === 'false') {
                return reply.status(200).send({ url: shorter.url }) 
            }
    
            return reply.redirect(shorter.url)
        })

    server.post<MakeUrl>(
        '/makeurl',
        async ({ body: { url, id } = {}, protocol, hostname }, reply) => {
            const origin = `${protocol}://${hostname}`
            if(!checkURL(url)) {
                return reply.status(400).send({
                    err: 'Provided URL isn\'t valid or empty'
                })
            }

            if (id?.length >= maxLength) {
                return reply.status(400).send({
                    // TODO: REFACTOR! MB SWAGGER?
                    err: 'ID is too long'
                })
            }

            const collision = await Shorter
                .where({ id })
                .findOne()

            if (collision) {
                return reply.status(400).send({
                    // TODO: REFACTOR! MB SWAGGER?
                    err: 'ID is already taken'
                })
            }

            if (!checkURL(`${origin}/${id}`)) {
                return reply.status(400).send({
                    err: 'ID isn\'t valid'
                })
            }
            
            const shorter = new Shorter({
                id: id || nanoid(defaultUrlLength),
                url
            })
            
            await shorter.save()

            return reply.status(200).send({
                url: `${origin}/${shorter.id}`
            })
        })
}

export default fp(ShorterRoutes)
