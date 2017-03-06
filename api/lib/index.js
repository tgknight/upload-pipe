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

  initUploadStram(destination, identifier, options = {}) {
    const file = this.storage.bucket(this.config.bucketName).file(destination)
    this.uploadStream[identifier] = file.createWriteStream(options)
  }

  pipeUploadStream(sourceStream, identifier) {
    sourceStream.pipe(this.uploadStream[identifier], { end: false })
  }

  endUploadStream(identifier) {
    this.uploadStream[identifier].end()
    delete this.uploadStream[identifier]
  }

  getMetadata(remotePath) {
    const file = this.storage.bucket(this.config.bucketName).file(remotePath)
    return file.getMetadata()
  }

  createReadStream(remotePath) {
    const file = this.storage.bucket(this.config.bucketName).file(remotePath)
    return file.createReadStream()
  }

  existFile(filePath) {
    const file = this.storage.bucket(this.config.bucketName).file(filePath)
    return file.exists()
  }

  getFile(filePath) {
    const file = this.storage.bucket(this.config.bucketName).file(filePath)
    return file.get()
  }

  deleteFile(filePath) {
    const file = this.storage.bucket(this.config.bucketName).file(filePath)
    return file.delete()
  }


}

module.exports = Google
