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
          var response = result["cas:serviceResponse"];
          var success = response["cas:authenticationSuccess"];
          var casuser = success[0]["cas:user"][0];
          console.log('valid: ' + casuser);

          var profileoptionsget = {
            host : 'webapp4.asu.edu', // here only the domain name
            // (no http/https !)
            port : 443,
            path : '/directory/ws/search?asuriteId=' + casuser, // the rest of the url with parameters if needed
            method : 'GET' // do GET
          };

          var profilereqGet = https.request(profileoptionsget, function(response) {
            console.log("statusCode: ", response.statusCode);

            response.on('data', function(pd) {
              console.info('GET result:\n');
              process.stdout.write(pd);

              var profilexml = pd;
              parseString(profilexml, function (error, profileresult) {
                console.dir(profileresult);
                var asuuser = {id:'', email: '', name: '', type:true};
                asuuser.id =  casuser;
                asuuser.email = profileresult.searchResults.person[0].email[0];
                asuuser.name = profileresult.searchResults.person[0].displayName[0];
                res.json(asuuser);
              });

            });
          });

          profilereqGet.end();
          profilereqGet.on('error', function(e) {
            console.error(e);
            res.send(e);
          });

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
