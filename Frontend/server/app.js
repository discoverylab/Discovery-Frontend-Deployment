/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
//process.env.NODE_ENV = process.env.NODE_ENV || 'development';


var https = require('https');
var fs         = require("fs");
var key_file   = "certs/localhost.key";
var cert_file  = "certs/discovery_a2c2_asu_edu.cer";

var httpsconfig     = {
  key: fs.readFileSync(key_file),
  cert: fs.readFileSync(cert_file)
};


var express = require('express');
var config = require('./config/environment');
// Setup server
var app = express();
var server = https.createServer(httpsconfig, app);
//var server = require('http').createServer(app);
require('./config/express')(app);
require('./routes')(app);

/*
// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});
*/

// Start https server
server.listen(3443, config.ip, function () {
  console.log('Express server listening on 3443, in %s mode', app.get('env'));
});

// Expose app
exports = module.exports = app;
