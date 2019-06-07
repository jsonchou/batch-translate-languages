const util = require('./util')
 
let version = process.env.VERSION || require('../package.json').version

module.exports = {
    ip: util.ip(),
    name: require('../package.json').name,
    env: process.env.NODE_ENV === 'production' ? 'p' : 'd',
    browsers: ["last 2 versions", "Firefox ESR", "> 1%", "ie >= 9", "iOS >= 8", "Android >= 4"],
    version,
    emoji: {
        cool: '\u{1F60E}',
        cry: '\u{1F602}',
    }
}