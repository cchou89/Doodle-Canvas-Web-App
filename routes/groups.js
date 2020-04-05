var express = require('express');
var mongoose = require('mongoose');
var Group = require('../models/group');
var User = require('../models/user');
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

/* SHOW: GET a group */
router.get("/:id", function (request, response) {
    console.log(request.params.id);
    Group.findById(request.params.id).exec(function (error, foundGroup){
        if(error){
            console.log(error);
            request.flash('error', 'could not find the group');
            response.redirect('/groups');
        } else {
            response.render('groups/show', {group : foundGroup});
        }
    });
});

/*EDIT group*/
/* INDEX:  GET Group listing. */
router.get('/:id/edit',function(request, response) {
// find the list of all Groups
    Group.findById(request)
        .exec()
        .then(function (error, foundGroup) {
            return Promise.all(foundGroup)
                .then(function (foundGroup) {
                    User.findById(foundGroup.members)
                        .exec()
                        .then(function () {
                            return Promise.all(members)
                                .then(function (found) {
                                    response.render('groups/edit', {group: foundGroup, members:found});
                                })
                                .catch(function (error) {
                                    request.flash('error', "Could not find the Group");
                                    response.redirect('/groups'
                                    );
                                });
                        });
                })
        })
        .catch(function (error) {
            request.flash('error', "Could not find the Group");
            response.redirect('/groups'
            );
        });
});

// UPDATE: PUT the edit page
router.put('/:id', function (request, response) {
    var memberList = request.body.member;
    var list = [];
    Group.findById(request.params.id)
        .then(function (error, foundLecture) {
            /* this update is not safe but works for now
            *  @TODO can be improved by using findByIdAndUpdate, or Buffer.alloc() */
            User.find({username: memberList})
                .exec()
                .then(function (result) {
                    return Promise.all(result)
                        .then(function findNewID(user) {
                            list = user.map(user => mongoose.Types.ObjectId(user._id.toString()));
                            console.log(list);
                            return list;
                        })
                        .catch(function (error) {
                            request.flash('error', "Could not update group");
                            //redirect back to index
                            response.redirect("/groups/new");
                        })
                        .then(function updateGroup(list) {
                            foundLecture.update(
                                {
                                    name: request.body.groupName
                                },
                                {
                                    $addToSet: {members: list}
                                });
                            foundLecture.save();
                        })
                        .catch(function (error) {
                            request.flash('error', "Could not update group");
                            //redirect back to index
                            response.redirect("/groups/new");
                        });
                })
                .catch(function (error) {
                    request.flash('error', "Could not update group");
                    //redirect back to index
                    response.redirect("/groups/new");
                });
        });
});

/* CREATE: POST Group form that creates a new Group */
router.post('/new', authenticate.isLoggedIn, function(request,response) {
    var name = request.body.groupName;
    var owner = request.user._id;
    var memberList= request.body.member;
    var list = [];

    User.find({username: memberList})
        .exec()
        .then(function(result) {
            return Promise.all(result)
                .then(function addId(user) {
                    list = user.map(user => mongoose.Types.ObjectId(user._id.toString()));
                    return list;
                })
        })
        .then(function fillSchema(list) {
            return {
                _id: mongoose.Types.ObjectId(),
                name: name,
                owner: owner,
                members: list
            };
        })
        .then(function createGroup(newGroup){
            //Create group
            Group.create(newGroup, function(error){
                if(error){
                    throw error;
                }else{
                    response.redirect("/groups/" + newGroup._id);
                }
            });
        })
        .catch(function(error){
            request.flash('error', "Could not create the group");
            //redirect back to index
            response.redirect("/groups/new");
        });
});

module.exports = router;
