'use strict'

import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import { get } from '../utils'

class Main extends Component {
  constructor(props) {
    super(props)
    this.state = {
      health: ''
    }
  }

  componentDidMount() {
    this.getStatus()
  }

  getStatus() {
    return get('/api/v1/')
      .then(response => {
        this.setState({ health: response.message })
      })
  }

  redirect() {
    const { origin } = window.location
    window.location = origin + '/upload'
  }

  render() {
    return (
      <div>
        <button onClick={() => this.getStatus()}>Check health</button>
        &nbsp;
        Health: {this.state.health}
        <br/><br/>
        <button onClick={() => this.redirect()}>Go to test upload-pipe</button>
      </div>
    )
  }
}

export default Main
