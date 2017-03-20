'use strict'

const winston = require('winston')
winston.emitErrs = true

module.exports = new winston.Logger({
  transport: [
    new winston.transports.Console({
      level: 'debug',
      prettyPrint: true,
      handleExceptions: true,
      json: false,
      colorize: true
    })
  ],
  exitOnError: false
})
