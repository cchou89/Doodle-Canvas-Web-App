var express = require('express');
var Group = require('../models/group');
var authenticate = require('../middleware/authenticate');
var router = express.Router();


// /* INDEX:  GET Group listing. */
router.get('/', function(request, response) {
    // find the list of all Groups
    Group.find({}, function (error, list) {
        if (error){
            request.flash('error', "Could not find the Group");
            response.redirect('/groups');
        } else {
            response.render('groups/index', {groups: list});
        }
    })
});

/* NEW: GET group form */
router.get("/new", authenticate.isLoggedIn, function(request, response){
        response.render('groups/new');
});

/* CREATE: POST Group form that creates a new Group */
router.post('/new', authenticate.isLoggedIn, function(request,response) {
        var name = request.body.groupName;
        var owner = request.user._id;
        var members = [request.body.memberInput];
        var newGroup = {name: name,
                        owner:owner,
                        members:members
                        };
        Group.create(newGroup, function (error) {
            if(error){
                request.flash('error', "Could not create the group");
                response.redirect("/groups/new");
            } else {
                //redirect back to index
                response.redirect("/groups");                }
        })
});



/* SHOW: GET a group */
router.get("/:id", function (request, response) {
    Group.findById(request.params.id).exec(function (error, foundGroup){
        if(error){
            console.log(error);
            request.flash('error', 'could not find the group');
            response.redirect('/groups');
        } else {
            response.render('groups/show', {group : foundGroup});
        }
    })
});

/* @TODO*/
// /* EDIT: GET the edit page */
// router.get("/:id/edit", authenticate.isLoggedIn(), function(request, response){
//     Lecture.findById(request.params.id, function (error, foundLecture) {
//         response.render('lectures/edit', {lecture : foundLecture});
//     });
// });
/* UPDATE: PUT the edit page */
// router.put('/:id', authenticate.isLoggedIn(), function (request, response) {
//     Lecture.findById(request.params.id, function (error, foundLecture) {
//         /* this update is not safe but works for now
//         *  @TODO can be improved by using findByIdAndUpdate, or Buffer.alloc() */
//         foundLecture.name = request.body.name;
//         if(request.files){
//             console.log("bgFile is true");
//             foundLecture.background_file = new Buffer( request.files.background_file.data ).toString('base64');
//         }
//         foundLecture.save();
//         response.redirect("/groups/" + request.params.id);
//     });
// });
/* DESTROY: DELETE a lecture*/
// router.delete("/:id", authenticate.lectureOwnership, function (request, response) {
//     Lecture.findById(request.params.id,function () {
//         Lecture.findByIdAndDelete(request.params.id,function (error) {
//             if (error) {
//                 request.flash('error', 'could not delete the lecture');
//                 response.redirect("/lectures");
//             } else {
//                 response.redirect("/lectures");
//             }
//         });
//     });
// });

module.exports = router;
