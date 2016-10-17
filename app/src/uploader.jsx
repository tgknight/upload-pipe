'use strict'

import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Flow from '../assets/flow'

import { get, post } from '../utils'

class Uploader extends Component {
  constructor(props) {
    super(props)
    this.state = {
      status: 'Idle',
      log: []
    }
    this.updateState = this.updateState.bind(this)
  }

  updateState(state) {
    this.setState(state)
  }

  _uploadFile(directory, file) {
    const { hostname, protocol } = window.location
    const serverUrl = `${protocol}//${hostname}:9091/api/v1/storages/part`

    const flow = new Flow({
      target: serverUrl,
      chunkSize: 5 * 1024 * 1024,
      testChunks: false,
      simultaneousUploads: 1,
      query: { directory }
    })

    let status = ''
    let name = file.name

    flow.addFile(file)
    return post('/api/v1/storages/init', { name, directory })
      .then(response => {
        console.log(response)
        status = 'Uploading ' + file.name
        console.log(status)
        flow.on('progress', () => {
          status = file.name + ' progress: ' + flow.progress()
          console.log(status)
        })
        flow.on('complete', () => {
          return post('/api/v1/storages/end', { name, directory })
            .then(response => {
              status = 'Complete with response: ' + response
              console.log(status)
            })
        })
        flow.upload()
      })
  }

  initFileUpload() {
    const file = this.refs.dataFile
    this._uploadFile('/', file.files[0])
  }

  render() {
    return (
      <div>
        <input type="file" ref="dataFile"/>
        <button onClick={() => this.initFileUpload()}>Upload</button>
      </div>
    )
  }
}

export default Uploader
