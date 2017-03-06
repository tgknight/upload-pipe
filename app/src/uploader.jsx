'use strict'

import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Flow from '../assets/flow'

import { get, post } from '../utils'

let flow = {}
let currentFile = {}

class Uploader extends Component {
  constructor(props) {
    super(props)
    this.state = {
      status: 'Idle',
      directory: '',
      filename: '',
      progress: 0
    }
    this.updateState = this.updateState.bind(this)
  }

  updateState(state) {
    this.setState(state)
  }

  _uploadFile(directory, file) {
    const { hostname, protocol } = window.location
    const serverUrl = `${protocol}//${hostname}:9091/api/v1/storages/part`

    flow = new Flow({
      target: serverUrl,
      chunkSize: 5 * 1024 * 1024,
      testChunks: false,
      simultaneousUploads: 1,
      query: { directory }
    })

    let status = ''
    let name = file.name
    currentFile = file

    flow.addFile(file)
    this.setState(Object.assign({}, this.state, {
      status: 'Uploading',
      directory,
      filename: name
    }))
    return post('/api/v1/storages/init', { name, directory, contentType: file.type })
      .then(response => {
        flow.on('progress', () => {
          this.updateState(Object.assign({}, this.state, {
            progress: Math.floor(flow.progress() * 100)
          }))
        })
        flow.on('complete', () => {
          this.updateState({
            status: 'Idle',
            progress: 0
          })
          return post('/api/v1/storages/end', { name, directory })
            .then(response => {
              status = 'Complete with response: ' + response.toString()
            })
        })
        flow.upload()
      })
  }

  cancelUpload() {
    flow.removeFile(currentFile)
    flow.cancel()
    flow.off()
    return post('/api/v1/storages/cancel', {
      name: this.state.filename,
      directory: this.state.directory
    })
      .then(response => {
        this.updateState({
          status: 'Idle',
          progress: 0
        })
      })
  }

  initFileUpload() {
    const file = this.refs.dataFile
    this._uploadFile('/', file.files[0])
  }

  render() {
    return (
      <div>
        Upload a file:<br/><br/>
        <input type="file" multiple ref="dataFile"/>
        <button onClick={() => this.initFileUpload()}>Upload</button>
        &nbsp;
        <button onClick={() => this.cancelUpload()}>Cancel Upload</button>
        <br/><br/>
        Status: {this.state.status}
        {this.state.progress ? ', progress: ' + this.state.progress + '%': ''}
      </div>
    )
  }
}

export default Uploader
