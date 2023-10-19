export const defaultUrlLength = 8
export const maxLength = 30
export const appConfig = () => {
    return {
        appPort: process.env.APP_PORT,
        mongoPort: process.env.MONGO_PORT,
        mongoTestPort: process.env.MONGO_TEST_PORT,
        mongoUser: process.env.MONGO_INITDB_ROOT_USERNAME,
        mongoPassword: process.env.MONGO_INITDB_ROOT_PASSWORD
    }
}

export const checkURL = (url: string): boolean => {
    // based on
    // https://stackoverflow.com/questions/1701898/how-to-detect-whether-a-string-is-in-url-format-using-javascript
    // https://www.debuggex.com/r/KaJrYj7vm9pKgOhK
    // TODO: IPv6 addresses
    const pattern = /^((https?)?:\/\/)(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?(([0-9]{1,3}\.){3}[0-9]{1,3}|([0-9a-z_!~*'()-]+\.)*([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\.[a-z]{2,6}|localhost|\[::1\])(:[0-9]{1,4})?((\/?)|(\/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+\/?)$/i

    return (new RegExp(pattern)).test(url)
}