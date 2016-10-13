'use strict'

import 'whatwg-fetch'
import React from 'react'
import ReactDOM from 'react-dom'

export function parseJSON(response) {
  return response.json()
    .then(body => ({
      status: response.status,
      statusText: response.statusText,
      body,
    }))
    .catch(err => response)
}

export function checkHttpStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response.body
  } else {
    const err = new Error(response.statusText)
    err.response = response.body
    throw err
  }
}

export function call(url, method, data) {
  const { hostname, protocol } = window.location
  const serverUrl = `${protocol}//${hostname}:9091${url}`
  return fetch(serverUrl, {
    method: method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(res => parseJSON(res))
    .then(res => checkHttpStatus(res))
    .catch(err => {
      if (typeof err.response === 'undefined') {
        err.response = {
          status: 408,
          message: 'Cannot connect to the server',
        }
      }

      throw err
    })
}

export function get(url) {
  return call(url, 'get')
}

export function post(url, data) {
  return call(url, 'post', data)
}
