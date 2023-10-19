import { Schema, model } from 'mongoose'
import 'mongoose-type-url'

export interface IShorter {
    id: string;
    url: string;
}

export const shorterSchema = new Schema<IShorter>({
    id: { type: String, required: true },
    url: { type: String, required: true }
});

export const Shorter = model<IShorter>('Shorter', shorterSchema);