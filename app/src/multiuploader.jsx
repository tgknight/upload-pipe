'use strict'

import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Flow from '../assets/flow'

import { get, post } from '../utils'

const { hostname, protocol } = window.location
const target = `${protocol}//${hostname}:9091/api/v1/storages/pipe`
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
      progress: {}
    }
    this.updateState = this.updateState.bind(this)
    this.displayProgress = this.displayProgress.bind(this)
  }

  updateState(state) {
    this.setState(state)
  }

  _uploadFile(directory, file, index) {
    const { name } = file
    flows[index] = new Flow(Object.assign({}, flowOptions, {
      query: { directory }
    }))

    flows[index].addFile(file)

    return post('/api/v1/storages/open', { name })
      .then(response => {
        flows[index].on('progress', () => {
          let uploadingProgress = {}
          uploadingProgress[name] = flows[index].progress() * 100
          let progress = Object.assign({}, this.state.progress, uploadingProgress)
          this.updateState(Object.assign({}, { progress }))
          // console.log(`file #${index + 1}: ${flows[index].progress() * 100}`)
        })
        flows[index].on('complete', () => {
          let finishedProgress = this.state.progress
          delete finishedProgress[name]
          this.updateState({
            progress: finishedProgress
          })
          console.log(`file #${index + 1} complete`)
          post('/api/v1/storages/close', { name })
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
    let uploadingFileList = Object.keys(this.state.progress)
    let progressString = ''
    for (let file of uploadingFileList) {
      progressString += `${file}: ${this.state.progress[file]} | `
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
        Status: {this.state.status}
        {this.state.progress ? this.displayProgress() : ''}
      </div>
    )
  }
}

export default MultiUploader
