###
Falcon framework
###
express = require 'express'
_       = require 'underscore'
_s      = require 'underscore.string'
fs      = require 'fs'
path    = require 'path'


falcon = () ->
  app = express()
  _.extend @, app

  # Inits the module arrays
  @modules = []
  @modulesTree = {}

  @

falcon.prototype.modulesTree = () -> @modulesTree

falcon.__defineSetter__ 'modules', (modules) ->
  for i, m in modules
    @addModule m

  @initModules()
  console.log '%j', @modulesTree

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

    # Adds the module to the tree.
    @modulesTree[moduleBaseName] = {}

    # Work with the module.
    @modulesTree[moduleBaseName].initFiles    = []
    @modulesTree[moduleBaseName].libFiles     = []
    @modulesTree[moduleBaseName].configFiles  = []
    @modulesTree[moduleBaseName].viewFiles    = []
    @modulesTree[moduleBaseName].mediaFiles   = []

    # Read the files in sync mode.
    ###
    The Module estruture:

      module
        bin
        lib
        media
        config
        views
        init.coffee

    ###
    files = fs.readdirSync m
    for file, i in files
      
      resolvedFilePath = path.resolve m, file
      stats = fs.statSync resolvedFilePath

      if not stats.isDirectory()
        if _s.startsWith file, 'init'
          @modulesTree[moduleBaseName].initFiles.push file
          require resolvedFilePath
        else
          console.log resolvedFilePath, " doesn't is a init file."
      else
        if file == 'lib'
          @modulesTree[moduleBaseName].libFiles     = dirToObject resolvedFilePath
        else if file == 'config'
          @modulesTree[moduleBaseName].configFiles  = dirToObject resolvedFilePath
        else if file == 'views'
          @modulesTree[moduleBaseName].viewFiles    = dirToObject resolvedFilePath
        else if file == 'media'
          @modulesTree[moduleBaseName].mediaFiles   = dirToObject resolvedFilePath

  console.log @modulesTree

dirToObject = (dir) ->
  console.log "Reading dir: ", dir
  files = fs.readdirSync dir
  a = {}

  for f, i in files
    keyname = path.basename f, path.extname(f)
    resolved = path.resolve dir, f
    a[keyname] = resolved

  return a;


module.exports = falcon