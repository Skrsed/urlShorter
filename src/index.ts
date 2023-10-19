import mongoose from 'mongoose'
import { app } from './app'

mongoose.connect('mongodb://root:example@localhost:27017')

app().listen({ port: 8088 }, (err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    console.log(`Server listening at ${address}`)
})