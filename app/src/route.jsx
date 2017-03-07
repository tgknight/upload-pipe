'use strict'

import React from 'react'
import { Route, IndexRoute } from 'react-router'

import Main from './main'
import Uploader from './uploader'
import MultiUploader from './multiuploader'

export default (
  <Route path="/">
    <IndexRoute component={Main}/>
    <Route path="upload" component={Uploader}/>
    <Route path="multiupload" component={MultiUploader}/>
  </Route>
)
