'use strict'

const parse = require('co-body')
const router = require('koa-router')()

router.get('/', function* () {
  this.status = 401
  this.body = 'Should not route to root'
})

router.get('/api/v1/', function* () {
  this.status = 200
  this.body = 'API was mounted successfully.'
})

module.exports = router
