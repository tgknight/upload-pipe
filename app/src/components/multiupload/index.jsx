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
    if (next.prevAction === 'request' ||
      ((next.prevAction === 'success' || next.prevAction === 'cancelSuccess') &&
      next.remainingFiles.length > 0)
    ) {
      this.props.dequeueUploadFile()
    }
    if (next.prevAction === 'dequeue') {
      this.props.uploadFile(this.state.destination, this.fileRefs.shift())
    }
  }

  _isStatusIdle() {
    return this.state.uploadingFile.identifier === undefined
  }

  _getFileList(files) {
    return Array.from(files)
  }

  _getFileIdentifier(files) {
    return Array.from(files).map(file => file.name)
  }

  initUploadProcess(directory, files) {
    this.fileRefs = this._getFileList(files)
    this.props.initUploadProcess(directory, this._getFileIdentifier(files))
  }

  getUploadingFileProgress() {
    let { identifier, progress } = this.state.uploadingFile
    return this._isStatusIdle() ? 'Idle' : (
      <span>
        Uploading {identifier} - {progress}%&nbsp;
        <button onClick = {() => this.props.cancelUploadingFile()}>Cancel</button>
      </span>
    )
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
        Status: {this.getUploadingFileProgress()}
        <br/>
        Files: {this.getRemainingFilesList()}
      </div>
    )
  }
}

export default MultiUploader
