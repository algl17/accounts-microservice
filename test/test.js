//Tests for Microservice routes
process.env.NODE_ENV = "debug"; //Tests must run on debug environment

var should = require('should');
require('should-http');
var request = require('supertest');
var mongoose = require('mongoose');
var config = require('../server/config/environment');
var AccountModel = require('../server/models/account');
var AccountUtils = require('../server/models/account.utils');

describe('Account Microservice', function() {
  var url = 'http://localhost:'+config.port+'/api';
  var email;
  before(function(done) {
    // use the test db
    //add mock entries to DB here
    var arrAccounts = [
      {
        Email: 'foo1.bar@mail',
        password: 'foo1',
        Name: 'Foo1',
        Birthday: '01-01-1990'
      },
      { 
        Email: 'foo2.bar@mail', 
        password: 'foo2', 
        Name: 'Foo2', 
        Birthday: '02-01-1990' 
      },
      { 
        Email: 'foo3.bar@mail', 
        password: 'foo3', 
        Name: 'Foo3', 
        Birthday: '03-01-1990' 
      } 
    ];
    mongoose.connect(config.mongoDB.uri);
    //Remove and repopulate DB
    AccountModel.remove({}, function(err) {
     AccountModel.create(arrAccounts, function (err, accounts) {
         if (err){throw err}
         done();
     });
    });
  });

  describe('Routes',function(){
    describe('Create', function() {
      it('should return error if missing Email', function (done){
        var account = {
          //Email: 'foo.bar@mail',  
          password: 'foo',  
          Name: 'Foo',  
          Birthday: '05-01-1990'  
        };
        request(url)
        .post('/user')
        .send(account)
        .end(function(err,res){
          if(err){throw err;}
          res.should.have.status(500);
          done();
        });
      });
      it('should return error if missing password', function (done){
        var account = {
          Email: 'foo.bar@mail',   
          //password: 'foo',   
          Name: 'Foo',   
          Birthday: '05-01-1990' 
        };
        request(url)
        .post('/user')
        .send(account)
        .end(function(err,res){
          if(err){throw err;}
          res.should.have.status(500);
          done();
        });
      });
      it('should return error if missing Name', function (done){
        var account = {
          Email: 'foo.bar@mail',   
          password: 'foo',   
          //Name: 'Foo',   
          Birthday: '05-01-1990'
        };
        request(url)
        .post('/user')
        .send(account)
        .end(function(err,res){
          if(err){throw err;}
          res.should.have.status(500);
          done();
        });
      });
      it('should return error if Type if missing Birthday', function (done){
        var account = {
          Email: 'foo.bar@mail',   
          password: 'foo',   
          Name: 'Foo',   
          //Birthday: '05-01-1990'
        };
        request(url)
        .post('/user')
        .send(account)
        .end(function(err,res){
          if(err){throw err;}
          res.should.have.status(500);
          done();
        });
      });
      it('should return the created object on success', function (done){
        var account = {
          Email: 'foo.bar@mail',   
          password: 'foo',   
          Name: 'Foo',   
          Birthday: '05-01-1990' 
        };
        request(url)
        .post('/user')
        .send(account)
        .expect('Content-Type', /json/)
        .expect(201) //Status Code
        .end(function(err,res){
          if(err){throw err;}
          res.body.Email.should.equal(account.Email);
          res.body.password.should.equal(account.password);
          res.body.Name.should.equal(account.Name);
          res.body.Birthday.should.equal(account.Birthday);
          done();
        });
      });
    });
    describe('Get', function(){
      it('should return not found for unexisting email', function (done){
        request(url)
        .get('/user/foo10.bar@mail/foo10')
        .send()
        .end(function(err,res){
          if(err){throw err;}
          res.should.have.status(404);
          done();
        });
      });
      it('should return the specified account on success', function (done){
        var account = {
          Email: 'foo1.bar@mail',   
          password: 'foo1',   
          Name: 'Foo1',   
          Birthday: '01-01-1990' 
        };
        request(url)
        .get('/user/'+account.Email+'/'+account.password)
        .send()
        .expect('Content-Type', /json/)
        .expect(200) //Status Code
        .end(function(err,res){
          if(err){throw err;}
          res.body.Email.should.equal(account.Email); 
          res.body.password.should.equal(account.password); 
          res.body.Name.should.equal(account.Name); 
          res.body.Birthday.should.equal(account.Birthday);
          done();
        });
      });
    });
    describe('Delete',function(){
      it('should return not found for unexisting email', function (done){
        request(url)
        .delete('/user/foo10.bar@mail')
        .send()
        .end(function(err,res){
          if(err){throw err;}
          res.should.have.status(404);
          done();
        });
      });
      it('should delete and return the data on success',function(done){
        var account = { //expected
          Email: 'foo2.bar@mail',   
          password: 'foo2',   
          Name: 'Foo2',   
          Birthday: '02-01-1990' 
        };
        request(url)
        .delete('/user/'+account.Email)
        .send()
        .expect('Content-Type', /json/)
        .expect(200) //Status Code
        .end(function(err,res){
          if(err){throw err;}
          //res.body._id.should.equal(habitId);
          res.body.Email.should.equal(account.Email);  
          res.body.password.should.equal(account.password);  
          res.body.Name.should.equal(account.Name);  
          res.body.Birthday.should.equal(account.Birthday);
          request(url)
          .delete('/user/'+account.Email)
          .send()
          .end(function(err,res){
            res.should.have.status(404);
            done();
          });
        });
      });
    });
//    describe('Delete All', function(){
//      it('should delete all entries for a user', function(done){
//        request(url)
//        .delete('/habits/user/foo.bar@mail')
//        .send()
//        .expect(204) //Status Code
//        .end(function(err,res){
//          if(err){throw err;}
//          request(url)
//          .get('/habits/user/foo.bar@mail')
//          .send()
//          .expect('Content-Type', /json/)
//          .expect(200) //Status Code
//          .end(function(err,res){
//            if(err){throw err;}
//            res.body.should.be.Array();
//            res.body.length.should.equal(0);
//            done();
//          });
//        });
//      });
//    });
  });
});
