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
    var members = [request.body.memberInput];
    var newGroupID = new mongoose.Types.ObjectId();
    var list = [];

    //TODO: Query list of members and add to list
    members.forEach(function(member){
       var query = User.findOne({name:member}, '*', function(error){
           if(error){
               console.log('Cannot find %s', name);
           } else{
               list.push(query);
           }
       });
    });

    var newGroup = {
                    _id: newGroupID,
                    name: name,
                    owner:owner,
                    members:list
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

    User.findByIdAndUpdate(owner, {
        $push:{
            groups: [newGroupID]
        }
    })
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
    })
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
