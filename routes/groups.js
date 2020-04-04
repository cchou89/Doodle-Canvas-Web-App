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
    var doc = Group.findById(request.params.id).exec(function (error, foundGroup){
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

// /* INDEX:  GET Group listing. */
router.get('/', function(request, response) {
    // find the list of all Groups
    Group.findById(request, function (error, list) {
        if (error){
            request.flash('error', "Could not find the Group");
            response.redirect('/groups');
        } else {
            response.render('groups/edit', {group: list});
        }
    })
});
module.exports = router;

/* CREATE: POST Group form that creates a new Group */
router.post('/new', authenticate.isLoggedIn, function(request,response) {
    console.log(request.body.member[0]);
    var name = request.body.groupName;
    var owner = request.user._id;
    var memberList= request.body.member;
    var list = [];

    User.find({username: memberList})
        .exec()
        .then(function(result) {
            console.log("We start here");
            console.log(result);
            return Promise.all(result)
                .then(function addId(user) {
                    console.log("step 2");
                    console.log(user);
                    list = user.map(user => mongoose.Types.ObjectId(user._id.toString()));
                    console.log(list);
                    return list;
                })
        })
        .then(function fillSchema(list) {
            return {
                name: name,
                owner: owner,
                members: list
            };
        })
        .then(function createGroup(newGroup){
            //Create group
            Group.create(newGroup, function (error) {
                response.redirect("/groups");
            });
        }).catch(function(error){
        request.flash('error', "Could not create the group");
        //redirect back to index
        response.redirect("/groups/new");
    });


    // member1.forEach(function(member){
    //     if(member !== ""){
    //         User.find({username: member}, function (error, user) {
    //             console.log(user);
    //             if (error) {
    //                 console.log('cannot find %s', member)
    //             } else {
    //                 console.log(user._id.toString());
    //                 list.push(user._id.toString());
    //             }
    //         });
    //     }
    // });
});
