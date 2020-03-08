var express = require('express');
var Lecture = require('../models/lecture');
var router = express.Router();

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
/* NEW: GET lecture form */
router.get("/new", function(request, response){
    if(!request.isAuthenticated()){
        request.flash('error', "First log in");
        response.redirect("/login");
    } else {
        response.render("lectures/new");
    }
});
/* CREATE: POST lecture form that creates a new lecture */
router.post('/new', function (request,response) {
        if(!request.isAuthenticated()){
            request.flash('error', "First log in");
            response.redirect("/login");
        } else {
            var name = request.body.name;
            // var background_url = request.body.background_url;
            var background_file = new Buffer(request.files.background_file.data).toString('base64');
            // var background_pdf = new mongodb.Binary(request.files.background_pdf.data);
            var author = request.user._id;
            var newLecture = {name: name, author:author ,
                // background_url:background_url,
                background_file:background_file,
                // background_pdf:background_pdf
            };
            Lecture.create(newLecture, function (error, item) {
                if(error){
                    request.flash('error', "Could not create the lecture");
                    response.redirect("/lectures/new");
                } else {
                    //redirect back to index
                    console.log(item);
                    response.redirect("/lectures");
                }
            });
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
