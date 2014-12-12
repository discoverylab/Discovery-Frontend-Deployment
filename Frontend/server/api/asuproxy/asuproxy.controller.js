/**
 * Created by mbalumur on 12/12/2014.
 */

/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');

// Get list of things
exports.index = function(req, res) {

  var https = require('https');

  /**
   * HOW TO Make an HTTP Call - GET
   */
// options for GET
  var optionsget = {
    host : 'weblogin.asu.edu', // here only the domain name
    // (no http/https !)
    port : 443,
    path : '/cas/serviceValidate?service=https%3A%2F%2Fdiscovery.a2c2.asu.edu&ticket=test', // the rest of the url with parameters if needed
    method : 'GET' // do GET
  };

  console.info('Options prepared:');
  console.info(optionsget);
  console.info('Do the GET call');

// do the GET request
  var reqGet = https.request(optionsget, function(res) {
    console.log("statusCode: ", res.statusCode);
    // uncomment it for header details
//  console.log("headers: ", res.headers);


    res.on('data', function(d) {
      console.info('GET result:\n');
      process.stdout.write(d);
      console.info('\n\nCall completed');
    });

  });

  reqGet.end();
  reqGet.on('error', function(e) {
    console.error(e);
  });

};
