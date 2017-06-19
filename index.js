/**
 * Created by liushaojie on 2017/6/17.
 */

const preProcess = require('./utils/preProcess.js')
const net = require('net')
const fs = require('fs')
let { log } = require('./utils/utils.js')

const routeSlide = () => {
    let slidePath = "/db/json_data/Slide_1.json"
    let slide = preProcess(slidePath)
    // log('\n debug slide : \n', JSON.stringify(slide, null, 4))
    const header = 'HTTP/1.1 200 OK\r\nContent-Type: text/slide\r\n'
    const r = header + '\r\n' + JSON.stringify(slide, null, 4)
    return r
}
const routeIndex = () => {
    const header = 'HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n'
    const body = fs.readFileSync('./public/index.html', 'utf-8')
    const r = header + '\r\n' + body
    return r
}
const error = (code=404) => {
    const e = {
        404: 'HTTP/1.1 404 NOT FOUND\r\n\r\n<h1>NOT FOUND</h1>',
    }
    const r = e[code] || ''
    return r
}

const responseForPath = (path) => {
    const r = {
        '/': routeIndex,
        '/slide': routeSlide,
    }
    // response 是一个函数, 直接在下面调用, 返回相应的响应
    const response = r[path] || error
    return response()
}
// 指定了默认的 host 和 port, 因为用的是默认参数, 当然可以在调用的时候传其他的值
const run = (host='', port=3000) => {
    const server = new net.Server()
    server.listen(port, host, () => {
        const address = server.address()
        console.log('listening.', address)
    })
    server.on('connection', (s) => {
        s.on('data', (data) => {
            const request = data.toString('utf8')
            const ip = s.localAddress
            log(`ip and request, ip 的值: ${ip}\nrequest 的内容\n${request}`)
            const path = request.split(' ')[1]
            log('path', path)
            const response = responseForPath(path)
            s.write(response)
            s.destroy()
        })
    })
    server.on('error', (error) => {
        log('server error', error)
    })
    server.on('close', () => {
        log('server closed')
    })
}
// 程序的入口
const __main = () => {
    run('127.0.0.1', 4000)
}
// 调用 main 函数
__main()

