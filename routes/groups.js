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

/* CREATE: POST Group form that creates a new Group */
router.post('/new', authenticate.isLoggedIn, function(request,response) {
    var name = request.body.groupName;
    var owner = request.user._id;
    console.log("We start here");
    console.log(owner);
    var member1= request.body.member1;
    console.log("This is the query");
    console.log(member1);
    var list = [];

    User.findOne({username: member1}, function (error, user) {
        console.log(user);
        if (error) {
            console.log('cannot find %s', member1)
        } else {
            console.log("This is the query");
            console.log(user._id);
            list.push(mongoose.Types.ObjectId(user._id.toString()));
        }
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

    var newGroup = {
                    name: name,
                    owner:owner,
                    members: list
                    };

    //Create group
    Group.create(newGroup, function (error) {
        if(error){
            request.flash('error', "Could not create the group");
            response.redirect("/groups/new");
        } else {
            //redirect back to index
            response.redirect("/groups");
        }
    });
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
