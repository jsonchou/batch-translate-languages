const fs = require('fs-extra');
const path = require('path');

module.exports = {
    appIndex: path.join(__dirname, '..', 'src/index/index.js'),
    appOptions: path.join(__dirname, '..', 'src/options/index.js')
}