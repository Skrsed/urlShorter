import { checkURL } from '../src/utils'

test('test url validation function', async () => {
    const correctCases = [
        'http://google.com',
        'https://google.com',
        'http://google.co',
        'https://google.com/test?param=foo',
        'https://google.com/t/e/s/t/c/a/s/e?urls=u'
    ]

    const wrongCases = [
        'google.com',
        'https://google.c',
        'htt://abc.de',
        'F#$$%YH%^BRGF#$T%H^YTGRE'
    ]

    correctCases.forEach((url) => {
        expect(checkURL(url)).toEqual(true)
    })

    wrongCases.forEach((url) => {
        expect(checkURL(url)).toEqual(false)
    })
})