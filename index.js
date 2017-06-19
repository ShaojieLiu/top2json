/**
 * Created by liushaojie on 2017/6/17.
 */

const net = require('net')
const fs = require('fs')
const routeMapper = require('./routes/routes')
const Request = require('./models/request')
let { log } = require('./utils/utils.js')

const error = (code=404) => {
    const e = {
        404: 'HTTP/1.1 404 NOT FOUND\r\n\r\n<h1>NOT FOUND</h1>',
    }
    const r = e[code] || ''
    return r
}

const parsedPath = (path) => {
    const index = path.indexOf('?')
    // 如果不包含 ?, query 是一个空对象
    if (index === -1) {
        return {
            path: path,
            query: {},
        }
    } else {
        // 如果包含 ?, 则按照 ? 将请求中的 path 分成 path 和 query
        const l = path.split('?')
        path = l[0]
        // query 的格式为 a=b&c=d&e=f
        const search = l[1]
        const args = search.split('&')
        const query = {}
        for (let arg of args) {
            const [k, v] = arg.split('=')
            query[k] = v
        }
        return {
            path: path,
            query: query,
        }
    }
}

const parsedRaw = (raw) => {
    const r = raw
    const line = r.split(' ')
    const method = line[0]
    const url = line[1]
    // const [method, url, ..._] = line
    const { path, query } = parsedPath(url)
    const message = r.split('\r\n\r\n')
    const headers = message[0].split('\r\n').slice(1)
    const body = message[1]

    return {
        method: method,
        path: path,
        query: query,
        headers: headers,
        body: body,
    }
}

const responseFor = (raw, request) => {
    const r = parsedRaw(raw)
    Object.assign(request, {
        method: r.method,
        path: r.path,
        query: r.query,
        body: r.body,
    })
    request.addHeaders(r.headers)
    log('\npath and query', r.path, r.query)
    const routes = Object.assign({}, routeMapper)
    // 获取 response 函数
    const response = routes[r.path] || error
    // 将 request 作为 response 的参数传出去, 这样每一个 response 都可以与对应的 request 挂钩
    const resp = response(request)
    return resp
}
// 指定了默认的 host 和 port, 因为用的是默认参数, 当然可以在调用的时候传其他的值
const run = (host='', port=4000) => {
    const server = new net.Server()

    server.listen(port, host, () => {
        const address = server.address()
        console.log('listening', address)
    })

    server.on('connection', (s) => {
        s.on('data', (data) => {
            const request = new Request()
            const r = data.toString('utf8')
            const ip = s.localAddress
            log(`\nip and request, ip 的值: ${ip}\nrequest 的内容\n${r}`)

            const response = responseFor(r, request)

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

