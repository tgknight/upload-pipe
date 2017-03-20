'use strict'

const app = require('koa')()
const compress = require('koa-compress')
const cors = require('koa-cors')
const responseTime = require('koa-response-time')
const router = require('./api/router')
const logger = require('./api/logger')

const options = {}

function customLogger(logger) {
  return function* middleware(next) {
    logger.info(`<-- ${this.method} ${this.originalUrl}`)

    let start = new Date()
    yield next
    let ms = new Date() - start

    let logLevel = 'info'
    if (this.status >= 500) logLevel = 'error'
    else if (this.status >= 400) logLevel = 'warn'

    let msg = `--> ${this.method} ${this.originalUrl} ${this.status} ${ms}ms`
    logger.log(logLevel, msg)
  }
}

app.use(compress())
app.use(cors(options))
app.use(customLogger(logger))
app.use(responseTime())
app.use(router.routes())

app.listen(9091, '0.0.0.0')
