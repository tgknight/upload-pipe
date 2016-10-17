'use strict'

import React from 'react'
import { Route, IndexRoute } from 'react-router'

import Main from './main'
import Uploader from './uploader'

export default (
  <Route path="/">
    <IndexRoute component={Main}/>
    <Route path="upload" component={Uploader}/>
  </Route>
)
