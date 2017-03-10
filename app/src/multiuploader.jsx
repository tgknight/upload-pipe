'use strict'

import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Flow from '../assets/flow'

import { get, post } from '../utils'

const { hostname, protocol } = window.location
const target = `${protocol}//${hostname}:9091/api/v1/storages/part`
let flowOptions = {
  target,
  chunkSize: 1 * 1024 * 1024,
  testChunks: false,
  simultaneousUploads: 1
}
let flows = []

class MultiUploader extends Component {
  constructor(props) {
    super(props)
    this.state = {
      status: 'Idle',
      progress: {}
    }
    this.updateState = this.updateState.bind(this)
    this.displayProgress = this.displayProgress.bind(this)
  }

  updateState(state) {
    this.setState(state)
  }

  _uploadFile(directory, file, index) {
    const { name, type } = file
    flows[index] = new Flow(Object.assign({}, flowOptions, {
      query: { directory }
    }))

    flows[index].addFile(file)

    return post('/api/v1/storages/init', { name, directory, contentType: type })
      .then(response => {
        flows[index].on('progress', () => {
          let uploadingProgress = {}
          uploadingProgress[name] = Math.floor(flows[index].progress() * 100)
          let progress = Object.assign({}, this.state.progress, uploadingProgress)
          this.updateState(Object.assign({}, { status: 'Uploading', progress }))
        })
        flows[index].on('complete', () => {
          let finishedProgress = this.state.progress
          delete finishedProgress[name]
          this.updateState({
            status: finishedProgress.length ? 'Uploading' : 'Idle',
            progress: finishedProgress
          })
          post('/api/v1/storages/end', { name })
        })
        flows[index].upload()
      })
  }

  initFileUpload() {
    const { files } = this.refs.dataFile
    for (let i = 0; i < files.length; i++) {
      this._uploadFile('/', files[i], i)
    }
  }

  displayProgress() {
    let uploadingFileList = Object.keys(this.state.progress) || []
    let progressString = []
    for (let file of uploadingFileList) {
      progressString.push(<span key={file}>{file}: {this.state.progress[file]}%<br/></span>)
    }

    return progressString
  }

  render() {
    return (
      <div>
        Upload files:<br/><br/>
        <input type="file" multiple ref="dataFile"/>
        <button onClick={() => this.initFileUpload()}>Upload</button>
        <br/><br/>
        Status: {this.state.status}<br/>
        {this.state.progress ? this.displayProgress() : ''}
      </div>
    )
  }
}

export default MultiUploader
