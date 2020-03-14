var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Lecture = require('../models/lecture');

/* GET users listing. */
router.get('/', function(request, response) {
  User.find({}, function (error, list) {
    if (error){
      request.flash('error', "Error searching for users");
      response.redirect('/');
    } else {
      response.render('users/index', {users: list});
    }
  });
});

/* GET a user's public profile */
router.get('/:id', function (request, response) {
  Lecture.find({'author': request.params.id }, function (error, list) {
    if (error){
      request.flash('error', "Error searching for the user's lectures");
      response.redirect('/');
    } else {
      User.findById( request.params.id, function (error, user) {
        if(error){
          request.flash('error', "Error looking up the user");
          response.redirect('/');
        } else {
          response.render('users/show', {lectures: list, user: user});
        }
      });
    }
  });
});

module.exports = router;
