const User = require('../models/user');
const sha256 = require('sha256');
const randomstring = require('randomstring');
const key = 'userToken';
const fs = require('fs');

module.exports.create = function(req,res){
  const user = new User();
  const salt = randomstring.generate(10);
  const pepper = randomstring.generate(10);

}

module.exports.login = function(req,res){
  // req.session.user = user
}

module.exports.logout = function(req,res){
  req.session.destroy(function(){
    res.redirect('/');
  })
}
