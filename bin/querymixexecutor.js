#!/usr/bin/node

var ExecuteQueryMixTransform = require('../lib/ExecuteQueryMixTransform');
var JSONStream = require('jsonstream');
process.stdin.pipe(JSONStream.parse()).pipe(new ExecuteQueryMixTransform());
