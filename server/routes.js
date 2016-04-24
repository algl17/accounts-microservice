/**
* Main app routes
*/
'use strict';

var express    = require('express');
var AccountModel = require('./models/account');
var AccountUtils = require('./models/account.utils');

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
//Get all info for a specified user.
//router.route('/user/:email')
//  .get(function(req, res){
//    AccountModel.find( {Email: req.params.email },function(err, account){
//      if(err){
//        return res.status(500).send(err);
//      }
//      return res.status(200).json(account);
//    });
//  });

//Delete an account.
//router.route('/user/:email')
//  .delete(function(req, res){
//    AccountModel.remove({Email: req.params.email }, function (err) {
//      if(err){
//        return res.status(500).send(err);
//      }
//      return res.status(204).send('No Content');
//    });
//  });

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

//Deletes a habit.
router.route('/user/:email')
  .delete(function(req, res){
    AccountModel.findOne({Email:req.params.email}, function (err, account) {
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
        return res.status(200).json(account);
      });
    });
  });

  app.use('/api', router);
};
