'use strict'

const app = require('koa')()
const compress = require('koa-compress')
const cors = require('koa-cors')
const responseTime = require('koa-response-time')
const router = require('./api/router')

const options = {}

app.use(compress())
app.use(cors(options))
app.use(responseTime())
app.use(router.routes())

app.listen(9091, '0.0.0.0')
