/**
 * Created by liushaojie on 2017/6/19.
 */

const fs = require('fs')
const preProcess = require('./utils/preProcess.js')

const headerFromMapper = (mapper={}) => {
    let base = 'HTTP/1.1 200 OK\r\n'
    const keys = Object.keys(mapper)
    const s = keys.map((k) => {
        const v = mapper[k]
        const h = `${k}: ${v}\r\n`
        return h
    }).join('')

    const header = base + s
    return header
}

const slides = () => {
    let slidePath = "/db/json_data/Slide_1.json"
    let slide = preProcess(slidePath)
    // log('\n debug slide : \n', JSON.stringify(slide, null, 4))
    const header = 'HTTP/1.1 200 OK\r\nContent-Type: text/slide\r\n'
    const r = header + '\r\n' + JSON.stringify(slide, null, 4)
    return r
}
const index = () => {
    const header = 'HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n'
    const body = fs.readFileSync('./public/index.html', 'utf-8')
    const r = header + '\r\n' + body
    return r
}
const static = (request) => {
    const filename = request.query.file || ''
    const path = `public/${filename}`
    const body = fs.readFileSync(path)
    const header = headerFromMapper()

    const h = Buffer.from(header + '\r\n')
    const r = Buffer.concat([h, body])
    return r
}


const routeMapper = {
    '/': index,
    '/static': static,
    '/slides': slides,
}

module.exports = routeMapper