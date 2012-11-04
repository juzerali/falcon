/*
Falcon framework
*/
var falcon, dirToObject, exports, express, fs, path, _, _s;

express = require('express');
_       = require('underscore');
_s      = require('underscore.string');
fs      = require('fs');
path     = require('path');

/*
Expose falcon
*/

exports = module.exports = falcon;

function falcon() {
  var app;
  app = express();
  _.extend(this, app);
  this.modulesPaths = [];
  this.modulesTree = {};
  return this;
};

falcon.__proto__.modules = function(modules) {
  for (var i = 0; i < modules.length; ++i) {
    var m = modules[i];
    this.addModule(m);
  }
  this.initModules();
};

/*
Add the module folder if theys exists.
*/
falcon.__proto__.addModule = function(module) {
  var resolvedModulePath;
  resolvedModulePath = path.resolve('./', module);

  if (fs.existsSync(resolvedModulePath)) {
    return this.modulesPaths.push(resolvedModulePath);
  } else {
    throw "This module path(" + resolvedModulePath + ") doesn't exists.";
  }
};

/*
Init the modules
        The Module estruture:
module
  bin
  lib
  media
  config
  views
  init.coffee
*/
falcon.__proto__.initModules = function() {

  // Iterates in each module  dir.
  for (var i = 0; i < this.modulesPaths.length; ++i) {

    var m = this.modulesPaths[i];

    var moduleBaseName = path.basename(m);


    this.modulesTree[moduleBaseName] = {};
    this.modulesTree[moduleBaseName].initFiles = [];
    this.modulesTree[moduleBaseName].libFiles = [];
    this.modulesTree[moduleBaseName].configFiles = [];
    this.modulesTree[moduleBaseName].viewFiles = [];
    this.modulesTree[moduleBaseName].mediaFiles = [];

    var files = fs.readdirSync(m);

    for (var j = 0; j < files.length; ++j) {
      
      var file = files[j];
      var resolvedFilePath = path.resolve(m, file);
      var stats = fs.statSync(resolvedFilePath);
      
      if (!stats.isDirectory()) {
        if (_s.startsWith(file, 'init')) {
          this.modulesTree[moduleBaseName].initFiles.push(file);
          require(resolvedFilePath);
        } else {
          console.log(resolvedFilePath, " doesn't is a init file.");
        }
      } else {
        if (file === 'lib') {
          this.modulesTree[moduleBaseName].libFiles = dirToObject(resolvedFilePath);
        } else if (file === 'config') {
          this.modulesTree[moduleBaseName].configFiles = dirToObject(resolvedFilePath);
        } else if (file === 'views') {
          this.modulesTree[moduleBaseName].viewFiles = dirToObject(resolvedFilePath);
        } else if (file === 'media') {
          this.modulesTree[moduleBaseName].mediaFiles = dirToObject(resolvedFilePath);
        }
      }
    }
  }
  console.log(this.modulesTree);
};

function dirToObject(dir) {
  var a, f, files, i, keyname, resolved, _i, _len;
  files = fs.readdirSync(dir);
  a = {};
  for (i = _i = 0, _len = files.length; _i < _len; i = ++_i) {
    f = files[i];
    keyname = path.basename(f, path.extname(f));
    resolved = path.resolve(dir, f);
    a[keyname] = resolved;
  }
  return a;
};