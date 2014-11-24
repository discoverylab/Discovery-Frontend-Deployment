/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
//process.env.NODE_ENV = process.env.NODE_ENV || 'development';

/*
var https = require('https');
var fs         = require("fs");
var key_file   = "certs/file.pem";
var cert_file  = "certs/file.crt";

var httpsconfig     = {
  key: fs.readFileSync(key_file),
  cert: fs.readFileSync(cert_file)
};
*/

var express = require('express');
var config = require('./config/environment');
// Setup server
var app = express();
//https.createServer(httpsconfig, app).listen(3443);
var server = require('http').createServer(app);
require('./config/express')(app);
require('./routes')(app);

// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;
