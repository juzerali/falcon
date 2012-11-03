/*
Basic example
*/

var app, falcon;

falcon = require('../../lib/falcon');

app = new falcon();

app.modules(['./basic-module']);