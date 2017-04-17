const Format = require('../models/format');
const Competitor = require('../models/competitor');
const Tournament = require('../models/tournament');

module.exports.formats = function(req,res){
  Format.find({}, function(err,docs){
    res.render('format', {formats: docs})
  })
}

module.exports.createFormat = function(req,res){
  const format = new Format();
  format.name = req.body.name;
  format.teamSize = req.body.teamSize;

  format.save(function(err,format){
    if(err){
      res.send(err)
    } else {
      res.redirect('/formats');
    }
  })
}

module.exports.tournaments = function(req,res){
  // Format.find({}, function(err,docs){
  //   res.render('tournaments', {formats: docs});
  // })

  Tournament.find({}).populate('format').exec(function(err, docs){
    if(err){
      res.send(err);
    } else {
      Format.find({}, function(error, documents){
        res.render('tournaments', {formats: documents, tournaments: docs, user: req.session.user});
      })
    }
  })
}

module.exports.createTournament = function(req,res){
  const tournament = new Tournament();

  tournament.title = req.body.title;
  tournament.format = req.body.format;

  tournament.save(function(err,tournament){
    if(err){
      res.send(err);
    } else {
      res.redirect('/tournaments');
    }
  })
}
