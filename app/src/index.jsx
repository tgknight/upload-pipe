'use strict'

import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Router, browserHistory } from 'react-router'

import routes from './route'

import { get, post } from '../utils'

const app = document.createElement('div')
document.body.appendChild(app)

ReactDOM.render(
  <Router children={routes} history={browserHistory}/>,
  app
)
