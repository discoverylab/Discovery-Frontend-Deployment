/**
 * Created by mbalumur on 12/12/2014.
 */
'use strict';

var express = require('express');
var controller = require('./asuproxy.controller');

var router = express.Router();

router.get('/', controller.index);

router.route('/ticket/:ticket_id')
  .get(function(req, res){


    var https = require('https');

    /**
     * HOW TO Make an HTTP Call - GET
     */
// options for GET
    var optionsget = {
      host : 'weblogin.asu.edu', // here only the domain name
      // (no http/https !)
      port : 443,
      path : '/cas/serviceValidate?service=https%3A%2F%2Fdiscovery.a2c2.asu.edu&ticket=' + req.params.ticket_id, // the rest of the url with parameters if needed
      method : 'GET' // do GET
    };

    console.info('Options prepared:');
    console.info(optionsget);
    console.info('Do the GET call');

// do the GET request
    var reqGet = https.request(optionsget, function(response) {
      console.log("statusCode: ", response.statusCode);
      // uncomment it for header details
//  console.log("headers: ", res.headers);


      response.on('data', function(d) {
        console.info('GET result:\n');
        process.stdout.write(d);
        var parseString = require('xml2js').parseString;
        var xml = d;
        parseString(xml, function (err, result) {
          console.dir(result);
          res.json(result);
        });

        console.info('\n\nCall completed');
      });

    });

    reqGet.end();
    reqGet.on('error', function(e) {
      console.error(e);
      res.send(e);
    });

  });

module.exports = router;