'use strict'

import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import { get } from '../utils'

class Main extends Component {
  constructor(props) {
    super(props)
  }

  handleClick() {
    return get('/api/v1/')
      .then(response => console.log(response))
  }

  render() {
    return (
      <div>
        <button onClick={() => this.handleClick()}>Check health</button>
      </div>
    )
  }
}

export default Main
