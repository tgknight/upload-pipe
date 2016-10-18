'use strict'

const parse = require('co-body')
const multipart = require('co-busboy')
const router = require('koa-router')()
const Google = require('./lib/')
const google = new Google({
  projectId: 'siwat-project',
  bucketName: 'pocket'
})
const entryPoint = 'pipe-test'

router.get('/', function* () {
  this.status = 401
  this.body = {
    message: 'Should not route to root'
  }
})

router.get('/api/v1/', function* () {
  this.status = 200
  this.body = {
    message: 'API was mounted successfully.'
  }
})

router.post('/api/v1/storages/init', function* () {
  const { name , directory } = yield parse.json(this)
  google.initUploadStram(entryPoint + directory + name, {
    metadata: { metadata: { originalFilename: name }}
  })
  this.status = 200
  this.body = {}
})

router.post('/api/v1/storages/part', function* () {
  const req = multipart(this)
  let fields = {}
  let part = {}
  let tempPath = yield req
  while ((part = yield req)) {
    if (part.length) {
      fields[part[0]] = part[1]
    } else {
      google.pipeUploadStream(part)
    }
  }
  this.status = 200
  this.body = {}
})

router.post('/api/v1/storages/end', function* () {
  const { name, directory } = yield parse.json(this)
  google.endUploadStream()
  this.status = 200
  this.body = {}
})

router.post('/api/v1/storages/cancel', function* () {
  const { name, directory } = yield parse.json(this)
  google.endUploadStream()
  let exist = false
  while (!(exist = yield google.existFile(entryPoint + directory + name))) {}
  yield google.deleteFile(entryPoint + directory + name)
  this.status = 200
  this.body = {}
})

module.exports = router
