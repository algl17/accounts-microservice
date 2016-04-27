'use strict';

//dependencies
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

//define Schema
var accountSchema = new Schema ({
  Email: { type: String, required: true},
  password: { type: String, required: true},
  Name: { type: String, required: true},
  Birthday: { type: String, required: false}
});

module.exports = mongoose.model('Account', accountSchema);
