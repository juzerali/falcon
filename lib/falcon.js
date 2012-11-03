/*
Falcon framework
*/
var createApplication, dirToObject, exports, express, fs, path, _, _s;
express = require('express');
_       = require('underscore');
_s      = require('underscore.string');
fs      = require('fs');
path     = require('path');

/*
Expose falcon
*/


exports = module.exports = createApplication;

createApplication = function() {
  var app;
  app = express();
  _.extend(this, app);
  this.modules = [];
  this.modulesTree = {};
  return this;
};

exports.modulesTree = function() {
  return this.modulesTree;
};

exports.modules = function(modules) {
  var i, m, _i, _len;
  for (m = _i = 0, _len = modules.length; _i < _len; m = ++_i) {
    i = modules[m];
    this.addModule(m);
  }
  return this.initModules();
};

/*
Add the module folder if theys exists.
*/


exports.addModule = function(module) {
  var resolvedModulePath;
  resolvedModulePath = path.resolve('./', module);
  if (fs.existsSync(resolvedModulePath)) {
    return this.modules.push(resolvedModulePath);
  } else {
    throw "This module path(" + resolvedModulePath + ") doesn't exists.";
  }
};

/*
Init the modules
*/


exports.initModules = function() {
  var file, files, i, m, moduleBaseName, resolvedFilePath, stats, _i, _j, _len, _len1, _ref;
  _ref = this.modules;
  for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
    m = _ref[i];
    moduleBaseName = path.basename(m);
    this.modulesTree[moduleBaseName] = {};
    this.modulesTree[moduleBaseName].initFiles = [];
    this.modulesTree[moduleBaseName].libFiles = [];
    this.modulesTree[moduleBaseName].configFiles = [];
    this.modulesTree[moduleBaseName].viewFiles = [];
    this.modulesTree[moduleBaseName].mediaFiles = [];
    /*
        The Module estruture:
    
          module
            bin
            lib
            media
            config
            views
            init.coffee
    */

    files = fs.readdirSync(m);
    for (i = _j = 0, _len1 = files.length; _j < _len1; i = ++_j) {
      file = files[i];
      resolvedFilePath = path.resolve(m, file);
      stats = fs.statSync(resolvedFilePath);
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
  return console.log(this.modulesTree);
};

dirToObject = function(dir) {
  var a, f, files, i, keyname, resolved, _i, _len;
  console.log("Reading dir: ", dir);
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