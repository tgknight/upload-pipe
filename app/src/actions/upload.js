'use strict'

import Flow from '../../assets/flow'
import { get, post } from '../utils'

const { hostname, protocol } = window.location
const target = `${protocol}//${hostname}:9091/api/v1/storages/part`
const flowOptions = {
  target,
  chunkSize: 5 * 1024 * 1024, // 5 Megabytes
  testChunks: false,
  simultaneousUploads: 1
}

let flow = undefined

export const UPLOAD_FILE_REQUEST = 'UPLOAD_FILE_REQUEST'
export const UPLOAD_FILE_DEQUEUE = 'UPLOAD_FILE_DEQUEUE'
export const UPLOAD_FILE_PROGRESS = 'UPLOAD_FILE_PROGRESS'
export const UPLOAD_FILE_SUCCESS = 'UPLOAD_FILE_SUCCESS'

export function uploadFileRequest(dest, queue) {
  return {
    type: UPLOAD_FILE_REQUEST,
    payload: { dest, queue }
  }
}

export function uploadFileDequeue() {
  return { type: UPLOAD_FILE_DEQUEUE }
}

export function uploadFileProgress(progress) {
  return {
    type: UPLOAD_FILE_PROGRESS,
    payload: { progress }
  }
}

export function uploadFileSuccess() {
  return { type: UPLOAD_FILE_SUCCESS }
}

export function initUploadProcess(directory, files) {
  return dispatch => dispatch(uploadFileRequest(directory, files))
}

export function dequeueUploadFile() {
  return dispatch => dispatch(uploadFileDequeue())
}

export function uploadFile(directory, file) {
  return dispatch => {
    const { name, type } = file
    flow = new Flow(Object.assign({}, flowOptions, {
      query: { directory }
    }))

    flow.addFile(file)

    return post('/api/v1/storages/init', { name, directory, contentType: type })
      .then(response => {
        flow.on('progress', () => {
          let progress = Math.floor(flow.progress() * 100)
          dispatch(uploadFileProgress(progress))
        })
        flow.on('complete', () => {
          post('/api/v1/storages/end', { name })
            .then(response => {
              dispatch(uploadFileSuccess())
            })
        })
        flow.upload()
      })
  }
}

export const UPLOAD_CANCEL_REQUEST = 'UPLOAD_CANCEL_REQUEST'
export const UPLOAD_CANCEL_SUCCESS = 'UPLOAD_CANCEL_SUCCESS'
export const UPLOAD_CANCEL_FAILURE = 'UPLOAD_CANCEL_FAILURE'

export function uploadCancelRequest() {
  return { type: UPLOAD_CANCEL_REQUEST }
}

export function uploadCancelSuccess() {
  return { type: UPLOAD_CANCEL_SUCCESS }
}

export function uploadCancelFailure() {
  return { type: UPLOAD_CANCEL_FAILURE }
}

export function cancelUploadingFile() {
  return (dispatch, getState) => {
    const { identifier, dest } = getState().upload.upload

    flow.pause()
    dispatch(uploadCancelRequest())
    return post('/api/v1/storages/cancel', { name: identifier, directory: dest })
      .then(response => {
        flow.off()
        dispatch(uploadCancelSuccess())
      })
      .catch(err => {
        dispatch(uploadCancelFailure())
        flow.resume()
      })
  }
}

export const REMOVE_FROM_QUEUE_REQUEST = 'REMOVE_FROM_QUEUE_REQUEST'
export const REMOVE_FROM_QUEUE_SUCCESS = 'REMOVE_FROM_QUEUE_SUCCESS'
export const REMOVE_FROM_QUEUE_FAILURE = 'REMOVE_FROM_QUEUE_FAILURE'

export function removeFromQueueRequest() {
  return { type: REMOVE_FROM_QUEUE_REQUEST }
}

export function removeFromQueueSuccess(queue) {
  return {
    type: REMOVE_FROM_QUEUE_SUCCESS,
    payload: { queue }
  }
}

export function removeFromQueueFailure() {
  return { type: REMOVE_FROM_QUEUE_FAILURE }
}

export function removeFromQueue(identifier) {
   return (dispatch, getState) => {
     const { queue } = getState().upload.upload
     const identifierIndex = queue.indexOf(identifier)

     dispatch(removeFromQueueRequest())
     if (identifierIndex > -1) {
       dispatch(removeFromQueueSuccess(queue.filter(item => item !== identifier)))
     } else {
       dispatch(removeFromQueueFailure())
     }
   }
}
