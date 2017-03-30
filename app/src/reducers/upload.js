'use strict'

import {
  UPLOAD_FILE_REQUEST, UPLOAD_FILE_DEQUEUE, UPLOAD_FILE_PROGRESS, UPLOAD_FILE_SUCCESS,
  UPLOAD_CANCEL_REQUEST, UPLOAD_CANCEL_SUCCESS, UPLOAD_CANCEL_FAILURE,
  REMOVE_FROM_QUEUE_REQUEST, REMOVE_FROM_QUEUE_SUCCESS, REMOVE_FROM_QUEUE_FAILURE
} from '../actions/upload'

const createReducer = (initialState, reducerMap) => {
  return (state = initialState, action) => {
    const reducer = reducerMap[action.type]
    return reducer ? reducer(state, action.payload) : state
  }
}

const initialState = {
  upload: {
    prevAction: undefined,
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
        prevAction: 'request',
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
        prevAction: 'dequeue',
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
        prevAction: 'progress',
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
        prevAction: 'success',
        dest: state.upload.dest,
        queue: state.upload.queue
      }
    })
  },
  [UPLOAD_CANCEL_REQUEST]: (state, payload) => {
    return Object.assign({}, state, {
      upload: {
        prevAction: 'cancelRequest',
        dest: state.upload.dest,
        identifier: state.upload.identifier,
        progress: state.upload.progress,
        queue: state.upload.queue
      }
    })
  },
  [UPLOAD_CANCEL_SUCCESS]: (state, payload) => {
    return Object.assign({}, state, {
      upload: {
        prevAction: 'cancelSuccess',
        dest: state.upload.dest,
        identifier: undefined,
        progress: 0,
        queue: state.upload.queue
      }
    })
  },
  [UPLOAD_CANCEL_FAILURE]: (state, payload) => {
    return Object.assign({}, state, {
      upload: {
        prevAction: 'cancelFailure',
        dest: state.upload.dest,
        identifier: state.upload.identifier,
        progress: state.upload.progress,
        queue: state.upload.queue
      }
    })
  },
  [REMOVE_FROM_QUEUE_REQUEST]: (state, payload) => {
    return Object.assign({}, state, {
      upload: {
        prevAction: 'removeFromQueueRequest',
        dest: state.upload.dest,
        identifier: state.upload.identifier,
        progress: state.upload.progress,
        queue: state.upload.queue
      }
    })
  },
  [REMOVE_FROM_QUEUE_SUCCESS]: (state, payload) => {
    return Object.assign({}, state, {
      upload: {
        prevAction: 'removeFromQueueSuccess',
        dest: state.upload.dest,
        identifier: state.upload.identifier,
        progress: state.upload.progress,
        queue: payload.queue
      }
    })
  },
  [REMOVE_FROM_QUEUE_FAILURE]: (state, payload) => {
    return Object.assign({}, state, {
      upload: {
        prevAction: 'removeFromQueueFailure',
        dest: state.upload.dest,
        identifier: state.upload.identifier,
        progress: state.upload.progress,
        queue: state.upload.queue
      }
    })
  },
}

export default createReducer(initialState, actions)
