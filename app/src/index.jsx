'use strict'

import React from 'react'
import ReactDOM from 'react-dom'
import thunk from 'redux-thunk'
import { Router, browserHistory } from 'react-router'
import { Provider } from 'react-redux'
import { applyMiddleware, compose, createStore } from 'redux'
import { createDevTools } from 'redux-devtools'
import LogMonitor from 'redux-devtools-log-monitor'
import DockMonitor from 'redux-devtools-dock-monitor'

import routes from './routes'
import reducers from './reducers'

const DevTools = createDevTools(
  <DockMonitor toggleVisibilityKey="ctrl-h"
    changePositionKey="ctrl-q"
    defaultIsVisible={false}>
    <LogMonitor theme="tomorrow" preserveScrollTop={false}/>
  </DockMonitor>
)
const store = createStore(
  reducers,
  compose(applyMiddleware(thunk), DevTools.instrument())
)

const app = document.createElement('div')
document.body.appendChild(app)

ReactDOM.render(
  <Provider store={store}>
    <div>
      <Router children={routes} history={browserHistory}/>
      <DevTools/>
    </div>
  </Provider>,
  app
)
