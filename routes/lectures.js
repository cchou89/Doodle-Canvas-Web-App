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

            var data = request.files.background_file.data;
            /*@TODO: Buffer constructor is depricated and undafe,
            *   change the code to use Buffer.alloc(size, string, encoding) */
            var background_file = new Buffer( data ).toString('base64');
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
router.get("/:id/edit", function(request, response){
    if(!request.isAuthenticated()){
        request.flash('error', "First log in");
        response.redirect("/login");
    } else {
        Lecture.findById(request.params.id).exec(function (error, foundLecture){
            if(error){
                console.log(error);
                request.flash('error', 'could not find the lecture');
                response.redirect('/lectures');
            } else if (foundLecture.author.equals(request.user._id)) {
                response.render('lectures/edit', {lecture : foundLecture});
            } else {
                request.flash("error", "You don't own the lecture");
                response.redirect("back");
            }
        })
    }
});
/* UPDATE: PUT the edit page */
router.put('/:id', function (request, response) {
    if (!request.isAuthenticated()) {
        request.flash('error', "First log in");
        response.redirect("/login");
    } else {
        Lecture.findById(request.params.id).exec(function (error, foundLecture) {
            console.log("found lecture");
            if (foundLecture.author.equals(request.user._id)) {
                /* this update is not safe but works for now
                *  @TODO can be improved by using findByIdAndUpdate, or Buffer.alloc() */
                foundLecture.name = request.body.name;
                if(request.files){
                    console.log("bgFile is true");
                    foundLecture.background_file = new Buffer( request.files.background_file.data ).toString('base64');
                }
                foundLecture.save();
                response.redirect("/lectures/" + request.params.id);
                // Lecture.findByIdAndUpdate(request.params.id, request.body.newLecture, function (error, updatedLecture) {
                //     if (error) {
                //         response.redirect("/lectures");
                //     } else {
                //         //redirect somewhere(show page)
                //         response.redirect("/lectures/" + request.params.id);
                //     }
                // });
            } else {
                request.flash("error", "You don't own the lecture");
                console.log("not the owner");
                response.redirect("back");
            }
        });
    }
});
/* DESTROY: DELETE a lecture*/
router.delete("/:id", function (request, response) {
    if (!request.isAuthenticated()) {
        request.flash('error', "First log in");
        response.redirect("/login");
    } else {
        Lecture.findById(request.params.id).exec(function (error, foundLecture) {
            if (foundLecture.author.equals(request.user._id)) {
                Lecture.findByIdAndDelete(request.params.id,function (error) {
                    if (error) {
                        request.flash('error', 'could not delete the lecture');
                        response.redirect("/lectures");
                    } else {
                        //redirect somewhere(show page)
                        response.redirect("/lectures");
                    }
                });
            } else {
                request.flash("error", "You don't own the lecture");
                console.log("not the owner");
                response.redirect("back");
            }
        });
    }
});

module.exports = router;
