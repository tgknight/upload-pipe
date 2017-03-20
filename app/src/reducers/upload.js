'use strict'

import { UPLOAD_FILE_REQUEST, UPLOAD_FILE_DEQUEUE, UPLOAD_FILE_PROGRESS, UPLOAD_FILE_SUCCESS } from '../actions/upload'

const createReducer = (initialState, reducerMap) => {
  return (state = initialState, action) => {
    const reducer = reducerMap[action.type]
    return reducer ? reducer(state, action.payload) : state
  }
}

const initialState = {
  upload: {
    dest: undefined,
    identifier: undefined,
    progress: undefined,
    queue: []
  }
}

let actions = {
  [UPLOAD_FILE_REQUEST]: (state, payload) => {
    return Object.assign({}, state, {
      upload: {
        dest: payload.dest,
        progress: 0,
        queue: payload.queue
      }
    })
  },
  [UPLOAD_FILE_DEQUEUE]: (state, payload) => {
    let queue = Object.assign([], state.upload.queue) // keep the state pure!
    let current = queue.shift()

    return Object.assign({}, state, {
      upload: {
        dest: state.upload.dest,
        identifier: current,
        progress: 0,
        queue
      }
    })
  },
  [UPLOAD_FILE_PROGRESS]: (state, payload) => {
    return Object.assign({}, state, {
      upload: {
        dest: state.upload.dest,
        identifier: state.upload.identifier,
        progress: payload.progress,
        queue: state.upload.queue
      }
    })
  },
  [UPLOAD_FILE_SUCCESS]: (state, payload) => {
    let isQueueEmpty = state.upload.queue.length === 0

    return Object.assign({}, state, {
      upload: isQueueEmpty ? initialState.upload : {
        dest: state.upload.dest,
        queue: state.upload.queue
      }
    })
  }
}

export default createReducer(initialState, actions)
