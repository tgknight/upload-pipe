'use strict'

import React from 'react'
import { Route, IndexRoute } from 'react-router'

// import Main from '../containers/main'
import MultiUploaderPage from '../containers/multiupload'

/* export default (
  <Route path="/">
    <IndexRoute component={Main}/>
    <Route path="multiupload" component={MultiUploader}/>
  </Route>
) */
export default (
  <Route path="/">
    <IndexRoute component={MultiUploaderPage}/>
  </Route>
)
