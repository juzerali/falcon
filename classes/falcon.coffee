###
Falcon framework
###
express = require 'express'
_       = require 'underscore'
fs      = require 'fs'
path    = require 'path'

falcon = () ->
  app = express()
  _.extend @, app

  # Inits the module arrays
  @modules = []
  @modulesTree = {}

  @

###
Add the module folder if theys exists.
###
falcon.prototype.addModule = (module) ->

  resolvedModulePath = path.resolve './', module

  if fs.existsSync(resolvedModulePath)
    @modules.push resolvedModulePath
  else
    throw "This module path(#{resolvedModulePath}) doesn't exists."

###
Init the modules
###
falcon.prototype.initModules = () ->
  for m, i in @modules
    
    moduleBaseName = path.basename(m)
    @modulesTree[moduleBaseName] = {}
    @modulesTree[moduleBaseName].initFiles = []

    files = fs.readdirSync m
    for f, i in files
      #fs.statSync 
      resolved = path.resolve m, f
      stats = fs.statSync resolved
      if not stats.isDirectory()
        @modulesTree[moduleBaseName].initFiles.push f

  console.log @modulesTree

module.exports = falcon