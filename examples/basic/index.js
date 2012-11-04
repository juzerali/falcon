/*
Basic example
*/
var app, falcon;

falcon = require('../../lib/falcon');

app = falcon();

app.modules(['./basic-module']);