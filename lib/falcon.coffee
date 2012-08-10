###
Falcon framework
###
express = require 'express'
_       = require 'underscore'
fs      = require 'fs'

falcon = () ->
  app = express()
  _.extend @, app

  # Inits the module arrays
  @modules = []

  @

falcon.prototype.addModule = (module) ->

  @modules.push module

module.exports = falcon