/**
*  Main app file
*/
'use strict';

//dependencies

var express  = require ('express');
var mongoose = require ('mongoose');
var config   = require ('./config/environment');

//connect to MongoDB
console.log("Connecting to DB: ", config.mongoDB.uri);
mongoose.connect(config.mongoDB.uri, config.mongoDB.options);
mongoose.connection.on('error', function(err){
  console.log('MongoDB connection error: ' + err);
    process.exit(-1);
    });
    console.log('Connected to DB');

    //setup server
    console.log('Starting server...');
    var app = express();
    require ('./config/express')(app);
    require ('./routes') (app);

    app.listen(config.port);
    console.log('Server listening on port: ' + config.port);
    module.exports = app;
