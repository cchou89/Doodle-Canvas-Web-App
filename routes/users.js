var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Lecture = require('../models/lecture');
var authenticate = require('../middleware/authenticate');

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
/* EDIT: GET the edit page */
router.get("/:id/edit", authenticate.isLoggedIn, function(request, response){
  User.findById(request.params.id, function (error, foundUser) {
    if(error){
      request.flash('error', 'could not find the user');
      response.redirect("/users/" + request.params.id);
    }
    response.render('users/edit', {user : foundUser});
  });
});
/* UPDATE: PUT the edit page */
/* @TODO only checks is the user is logged in, does not check ownership of the account */
router.put('/:id', authenticate.isLoggedIn, function (request, response) {
  User.findById(request.params.id, function (error, foundUser) {
    if(error){
      request.flash('error', 'something went wrong');
      response.redirect("/users/" + request.params.id);
    } else {
      console.log(request.body);
      foundUser.username = request.body.username;
      foundUser.save();
      response.redirect("/users" );
    }
  });
});
// /* DESTROY: DELETE a user*/
// /* @TODO only checks is the user is logged in, does not check ownership of the account */
router.delete("/:id", authenticate.isLoggedIn, function (request, response) {
  /* first destroy all lectures owned by the user */
  Lecture.find({'author': request.params.id }, function (error, lectures) {
    if (error){
      request.flash('error', "Error searching for the user's lectures");
      response.redirect('/');
    } else {
      lectures.forEach(function(lecture){
        Lecture.findByIdAndDelete(lecture._id, function (error) {
          if (error) {
            console.log('could not delete all lectures');
            request.flash('error', 'could not delete all lectures of the user');
            response.redirect("/users/" + request.params.id);
          }
        });
      });
    }
  });
    /* then delete the user */
  User.findByIdAndDelete(request.params.id, function (error) {
      if (error) {
        request.flash('error', 'could not delete the user');
        response.redirect("/users");
      } else {
        response.redirect("/users");
      }
    });
});


module.exports = router;
