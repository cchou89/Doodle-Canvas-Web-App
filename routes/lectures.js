var express = require('express');
var router = express.Router();
var Lecture = require('../models/lecture');

/* INDEX:  GET lecturs listing. */
router.get('/', function(request, response) {
    // find the list of all lectures
    Lecture.find({}, function (error, list) {
        if (error){
            request.flash('error', "Could not find the Lecture");
            response.redirect('/lectures');
        } else {
            response.render('lectures/index', {lectures: list});
        }
    })
});
/* CREATE: POST lecture form that creates a new lecture */
router.post('/', function (request,response) {
        if(!request.isAuthenticated()){
            request.flash('error', "First log in");
            request.redirect("/login");
        } else {
            var name = request.body.name,
                background_url = request.body.background_url,
                background_file = request.body.background_file,
                author = request.user._id,
                newLecture = {name: name, author:author,background_file:background_file, background:background_url};
            Lecture.create(newLecture, function (error, item) {
                if(error){
                    request.flash('error', "Could not create the lecture");
                    response.redirect("/new");
                } else {
                    //redirect back to index
                    console.log(item);
                    response.redirect("/lectures");                }
            })
        }
});

/* NEW: GET lecture form */
router.get("/new", function(request, response){
    if(!request.isAuthenticated()){
        request.flash('error', "First log in");
        response.redirect("/login");
    } else {
        response.render("lectures/new");
    }
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
/* UPDATE: POST the edit page */
/* DESTROY: DELETE a lecture*/
// router.delete("/:id", function (request, response) {
//     response.redirect('/lectures')
// });

module.exports = router;
