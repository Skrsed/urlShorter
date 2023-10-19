export type IdPayload = {
    id: string
}
  
export type UrlPayload = {
    url: string
}

export type HttpError = {
    '4xx': { err: string }
}