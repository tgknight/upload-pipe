'use strict'

import React, { Component } from 'react'

class MultiUploader extends Component {
  constructor(props) {
    super(props)
    this.state = {
      status: 'Idle',
      destination: this.props.destination,
      uploadingFile: this.props.uploadingFile,
      remainingFiles: this.props.remainingFiles
    }
    this.fileRefs = []

    this._isStatusIdle = this._isStatusIdle.bind(this)
    this.initUploadProcess = this.initUploadProcess.bind(this)
    this.getUploadingFileProgress = this.getUploadingFileProgress.bind(this)
    this.getRemainingFilesList = this.getRemainingFilesList.bind(this)
  }

  componentWillReceiveProps(next) { // this should be better, but not it works
    this.setState({
      status: 'Uploading',
      destination: next.destination,
      uploadingFile: next.uploadingFile,
      remainingFiles: next.remainingFiles
    })
    if (!next.uploadingFile.identifier && next.remainingFiles.length > 0) {
      this.props.dequeueUploadFile()
    }
    if (next.uploadingFile.identifier && next.uploadingFile.progress === 0) {
      let currentFile = this.fileRefs.shift()
      this.props.uploadFile(this.state.destination, currentFile)
    }
  }

  _isStatusIdle() {
    return this.state.uploadingFile.identifier === undefined
  }

  _getFileList(files) {
    return Array.from(files).map(file => file.name)
  }

  _setFileRefs(files) {
    return Array.from(files)
  }

  initUploadProcess(directory, files) {
    this.fileRefs = this._setFileRefs(files)
    this.props.initUploadProcess(directory, this._getFileList(this.fileRefs))
  }

  getUploadingFileProgress() {
    let { identifier, progress } = this.state.uploadingFile
    return this._isStatusIdle() ? 'Idle' : `Uploading ${identifier} - ${progress}%`
  }

  getRemainingFilesList() {
    return this._isStatusIdle() ? '' : this.state.remainingFiles.map(file => <span key={file}>{file} </span>)
  }

  render() {
    return (
      <div>
        Upload files:<br/><br/>
        <input type="file" multiple ref="dataFile"/>
        <button onClick={() => this.initUploadProcess('/', this.refs.dataFile.files)}>Upload</button>
        <br/><br/>
        Status: {this.getUploadingFileProgress()}<br/>
      Files: {this.getRemainingFilesList()}
      </div>
    )
  }
}

export default MultiUploader
