'use strict'

import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import MultiUploader from '../../components/multiupload'
import * as UploadActions from '../../actions/upload'

class MultiUploaderPage extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <MultiUploader
          destination={this.props.destination}
          uploadingFile={this.props.uploadingFile}
          remainingFiles={this.props.remainingFiles}
          initUploadProcess={(directory, files) => this.props.initUploadProcess(directory, files)}
          dequeueUploadFile={() => this.props.dequeueUploadFile()}
          endUploadFile={() => this.props.endUploadFile()}
          uploadFile={(directory, file) => this.props.uploadFile(directory, file)}
        />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  destination: state.upload.upload.dest,
  uploadingFile: {
    identifier: state.upload.upload.identifier,
    progress: state.upload.upload.progress
  },
  remainingFiles: state.upload.upload.queue
})

const mapDispatchToProps = dispatch => bindActionCreators(Object.assign({}, UploadActions), dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(MultiUploaderPage)