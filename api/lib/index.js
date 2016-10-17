'use strict'

const _ = require('lodash')
const fs = require('mz/fs')
const gcloud = require('gcloud-storage')
const Promise = require('bluebird')

class Google {
  constructor(config) {
    this.config = config
    this.storage = new gcloud({
      projectId: this.config.projectId
    })
    this.uploadStream = {}
  }

  initUploadStram(destination, options = {}) {
    const file = this.storage.bucket(this.config.bucketName).file(destination)
    this.uploadStream = file.createWriteStream(options)
  }

  pipeUploadStream(sourceStream) {
    sourceStream.pipe(this.uploadStream, { end: false })
  }

  endUploadStream() {
    this.uploadStream.end()
  }
}

module.exports = Google
