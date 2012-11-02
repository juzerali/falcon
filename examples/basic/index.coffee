###
Basic example
###

falcon = require '../../lib/falcon'

app = new falcon()

app.modules ['./basic-module']

console.log app.modulesTree()

#console.log app