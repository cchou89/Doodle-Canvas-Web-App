var Lecture = require("../models/lecture");
// var User = require("../models/user");

var authenticate = {};

/* Basic Authentication for creating lectures and groups, or opening the user profile */
authenticate.isLoggedIn = function(request, response, next){
    if(request.isAuthenticated()){
        return next();
    }
    request.flash('error', "First log in");
    response.redirect("/login");
};

authenticate.lectureOwnership = function(request, response, next) {
    if(!request.isAuthenticated()){
        request.flash('error', "First log in");
        response.redirect("/login");
    } else {
        Lecture.findById(request.params.id).exec(function (error, foundLecture){
            if(error){
                request.flash('error', 'could not find the lecture');
                response.redirect('/lectures');
            } else if (!foundLecture.author.equals(request.user._id)) {
                request.flash("error", "You don't own the lecture");
                response.redirect("back");
            } else {
                next();
            }
        });
    }
};

module.exports = authenticate;
