const misc = require('./build/misc')

let { spa, env, version, name } = misc;

module.exports = {
    parser: false,
    map: env === 'd' ? 'inline' : false,
    plugins: {
        'postcss-import': {},
        'postcss-preset-env': {},
        "autoprefixer": { browsers: ['last 2 versions', 'iOS >= 8'] },
        'cssnano': env === 'p' ? {} : false
    }
}