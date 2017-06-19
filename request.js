/**
 * Created by liushaojie on 2017/6/19.
 */

class Request {
    constructor() {
        this.raw = ''
        this.method = 'GET'
        this.path = ''
        this.query = {}
        this.body = ''
        this.headers = {}
        this.cookies = {}
    }

    // 将请求 headers 中的 cookies 解析成 object 对象,
    // 并且保存到 request.cookies 中
    // user=vn7hawwfsjkjc7fk; max-age=1000; valid=false
    addCookies() {
        const cookies = this.headers.Cookie || ''
        const pairs = cookies.split('; ')
        // [
        //     'user=vn7hawwfsjkjc7fk',
        //     'max-age=1000',
        //     'valid=false',
        // ]
        pairs.forEach((pair) => {
            if (pair.includes('=')) {
                const [k, v] = pair.split('=')
                this.cookies[k] = v
            }
        })
    }

    // 将请求中的 headers 解析成 object 对象,
    // 并且保存到 request.headers 中
    addHeaders(headers) {
        headers.forEach((header) => {
            const [k, v] = header.split(': ')
            this.headers[k] = v
        })
        // 直接调用 addCookies 处理 cookies
        this.addCookies()
    }

    //
    form() {
        const body = decodeURIComponent(this.body)
        const pairs = body.split('&')
        const d = {}
        for (let pair of pairs) {
            const [k, v] = pair.split('=')
            d[k] = v
        }
        return d
    }
}

module.exports = Request
/*
 GET /login HTTP/1.1
 Host: 127.0.0.1:5000
 Connection: keep-alive
 Cache-Control: max-age=0
 Upgrade-Insecure-Requests: 1
 User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.96 Safari/537.36
 Accept-Encoding: gzip, deflate, sdch, br
 Accept-Language: zh-CN,zh;q=0.8
 Cookie: user=dewfd7vd3uom6skw

 */