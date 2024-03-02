const http = require('http');
const autochart = require('autochart')
const chartTemplate = require('./chartTemplate')

const allowedTypes = Object.keys(autochart)

/**
 * Starts a server displaying a chart.
 * @param {string} type Type of chart : line / bar / pie / doughnut / radar / polarArea.
 * @param {*} data Arbitrary 2-level Object / Array.
 * @param {object} [options] Optional parameters.
 */
const startServer = (type, data, options = {}) => {
    if(!allowedTypes.includes(type)) {
        throw 'Unknown type ' + type + '. Allowed : [' + allowedTypes.join(', ') + ']'
    }
    
    const hostname = options.hostname || '127.0.0.1'
    const port = options.port || '8001'
    
    try {
        const chart = autochart[type](data)
        http.createServer((req, res) => {
            res.end(chartTemplate(chart));
        }).listen(port, hostname, () => {
            if(options.callback) {
                callback(null)
            } else {
                console.log(`QuickChart is running on ${hostname}:${port}`)
            }
        })
    } catch(error) {
        if(options.callback) {
            callback(error)
        } else {
            console.error(error)
        }
    }
}

module.exports = startServer