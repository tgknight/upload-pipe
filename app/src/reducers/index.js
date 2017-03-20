'use strict'

import { combineReducers } from  'redux'
import { routerReducer } from 'react-router-redux'

import upload from './upload'

const rootReducer = combineReducers({
  routing: routerReducer, upload
})

export default rootReducer
