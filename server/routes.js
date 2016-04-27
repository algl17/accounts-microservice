/**
* Main app routes
*/
'use strict';

var express    = require('express');
var AccountModel = require('./models/account');
var AccountUtils = require('./models/account.utils');
var config = require('../server/config/environment');
var firebase = require("firebase");
var http = require('http');

module.exports = function(app){
//Routes for the API
var router = express.Router();

router.use(function(req, res, next) {
  next();
});

//general routes
router.get('/', function(req,res){
  res.json({
    microservice: 'accounts-microservice',
    owner: 'Lorena Gonzalez'
  });
});
//API Accounts routes
  //Creates a new account for the user.
router.route('/user')
  .post(function(req, res){
    AccountModel.create(req.body, function(err, account) {
      if(err) {
        return res.status(500).send(err);
      }
      return res.status(201).json(account);
    });
  });

//Returns user information.
router.route('/user/:email/:password')
  .get(function(req, res){
    AccountModel.findOne({Email: req.params.email, password:req.params.password},function(err, account){
      if(err){
        return res.status(500).send(err);
      }
      if(!account) {
        return res.status(404).send('Not Found');
      }
      return res.status(200).json(account);
    });
  });

//Deletes a user.
router.route('/user/:email')
  .delete(function(req, res){
    AccountModel.findOne({Email:req.params.email}, function (err, account) {
      var email = req.params.email;
      if(err) {
        return res.status(500).send(err);
      }
      if(!account) {
        return res.status(404).send('Not Found');
      }
      account.remove(function(err) {
        if(err) {
          return res.status(500).send(err);
        }
       var habitIP;
       var habitPort;
       var ref = new Firebase(config.firebase.services+'/habits').on('value', function (snapshot) {
          var values = [];
          snapshot.forEach(function(childSnapshot) {
          values.push(childSnapshot.val());
          });
          console.log(values);
          habitIP = values[0];
          habitPort = values[1];
          console.log(habitIP);
          var options = {
              host: habitIP,
              path: '/api/habits/user/'+email,
              port: habitPort,
              method: 'DELETE'
          };
          console.log(options.path);
          var req = http.request(options, function(){console.log('DELETED')});
          req.on('error', function(err){
            console.log(err);
          });
          req.write("Hola");
          req.end();
       });

       var taskIP;
       var taskPort;
       var refT = new Firebase(config.firebase.services+'/tasks').on('value', function (snapshot) {
          var values = [];
          snapshot.forEach(function(childSnapshot) {
          values.push(childSnapshot.val());
          });
          taskIP = values[0];
          taskPort = values[1];
          console.log(habitIP);
          var options = {
              host: taskIP,
              path: '/api/tasks/user/'+email,
              port: taskPort,
              method: 'DELETE'
          };
          console.log(options.path);
          var req = http.request(options, function(){console.log('DELETED')});
          req.on('error', function(err){
            console.log(err);
          });
          req.write("Hola");
          req.end();
       });
    

     
       //var request=require("request");
       //console.log(Habit);
       //request.del('10.43.9.35:9001/habits/user/'+req.params.email,function(error,response,body){
       //  if(error){
       //     console.log(error);
       //  }else{
       //      console.log(response);
       //      console.log(response);
       //  }
       //});
       //request.del('10.43.9.35:9001/tasks/user/'+req.params.email,function(error,response,body){
       //  if(error){
       //     console.log(error);
       //  }else{
       //      console.log(response);
       //      console.log(response);
       //  }
       //});

        return res.status(200).json(account);
      });
    });
  });

  app.use('/api', router);
};
