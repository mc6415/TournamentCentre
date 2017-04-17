const User = require('../models/user');
const Competitor = require('../models/competitor');
const sha256 = require('sha256');
const randomstring = require('randomstring');
const key = 'userToken';
const fs = require('fs');

module.exports.create = function(req,res){
  const user = new User();
  const salt = randomstring.generate(10);
  const pepper = randomstring.generate(10);

  user.username = req.body.username;
  user.salt = salt;
  user.pepper = pepper;
  user.password = sha256(salt) + sha256(req.body.password) + sha256(pepper);
  user.battleTag = req.body.battleTag;
  user.isAdmin = 0;

  user.save(function(err,user){
    if(err){
      res.render('index', {
        toast: true,
        toastType: 'error',
        toastMessage: 'Error Registering Account, if this happens again please contact the site admin.'
    })
  } else {
    res.render('index', {
      toast: true,
      toastType: 'success',
      toastMessage: 'Succesfully registered account, welcome ' + user.username + '! :)'
    })
  }
  })

}

module.exports.login = function(req,res){
  User.find({username: req.body.username}, function(err, docs){
    if(err){
      res.render('index', {
        toast: true,
        toastType: 'error',
        toastMessage: 'Unexpected Error occured while logging in, if this happens again please contact the site admin'
      })
    } else {
      const user = docs[0];
      const passwordEntry = sha256(user.salt) + sha256(req.body.password) + sha256(user.pepper);
      if(user.password == passwordEntry){
        req.session.user = user;
        res.redirect('/dashboard');
      } else {
        res.render('index', {
          toast: true,
          toastType: 'error',
          toastMessage: 'Failed to login, is your password correct?'
        })
      }
    }
  })
}

module.exports.home = function(req,res){
  Competitor.find({user: req.session.user}, function(err,docs){
    if(err){
      res.send(err);
    } else{
      console.log(docs);
      res.render('dashboard', {user: req.session.user})
    }

  })
}

module.exports.logout = function(req,res){
  req.session.destroy(function(){
    res.redirect('/');
  })
}
