var express = require('express');
var Lecture = require('../models/lecture');
var authenticate = require('../middleware/authenticate');
var router = express.Router();

/* INDEX:  GET lecturs listing. */
router.get('/', function(request, response) {
    // find the list of all lectures
    Lecture.find({}, function (error, list) {
        if (error){
            request.flash('error', "Error searching for lectures");
            response.redirect('/');
        } else {
            response.render('lectures/index', {lectures: list});
        }
    });
});
/* NEW: GET lecture form */
router.get("/new", authenticate.isLoggedIn, function(request, response){
        response.render("lectures/new");
});

/* CREATE: POST lecture form that creates a new lecture */
router.post('/new', authenticate.isLoggedIn, function (request,response) {
        var data = request.files.background_file.data;
        /*@TODO: Buffer constructor is deprecated and unsafe,
        *   change the code to use Buffer.alloc(size, string, encoding) */
        var background_file = new Buffer( data ).toString('base64');
        var newLecture = {name: request.body.name,
                          author: request.user._id ,
                          background_file: background_file,
                        };
        Lecture.create(newLecture, function (error) {
            if(error){
                request.flash('error', "Could not create the lecture");
                response.redirect("/lectures/new");
            } else {
                //redirect back to index
                response.redirect("/lectures");
            }
        });
});

/* SHOW: GET a lecture */
router.get("/:id", function (request, response) {
    Lecture.findById(request.params.id).exec(function (error, foundLecture){
        if(error){
            console.log(error);
            request.flash('error', 'could not find the lecture');
            response.redirect('/lectures');
        } else {
            response.render('lectures/show', {lecture : foundLecture});
        }
    })
});
/* @TODO*/
/* EDIT: GET the edit page */
router.get("/:id/edit", authenticate.lectureOwnership, function(request, response){
    Lecture.findById(request.params.id, function (error, foundLecture) {
        response.render('lectures/edit', {lecture : foundLecture});
    });
});
/* UPDATE: PUT the edit page */
router.put('/:id', authenticate.lectureOwnership, function (request, response) {
    Lecture.findById(request.params.id, function (error, foundLecture) {
        /* this update is not safe but works for now
        *  @TODO can be improved by using findByIdAndUpdate, or Buffer.alloc() */
        foundLecture.name = request.body.name;
        if(request.files){
            console.log("bgFile is true");
            foundLecture.background_file = new Buffer( request.files.background_file.data ).toString('base64');
        }
        foundLecture.save();
        response.redirect("/lectures/" + request.params.id);
    });
});
/* DESTROY: DELETE a lecture*/
router.delete("/:id", authenticate.lectureOwnership, function (request, response) {
    Lecture.findById(request.params.id,function () {
        Lecture.findByIdAndDelete(request.params.id,function (error) {
            if (error) {
                request.flash('error', 'could not delete the lecture');
                response.redirect("/lectures");
            } else {
                response.redirect("/lectures");
            }
        });
    });
});

module.exports = router;
