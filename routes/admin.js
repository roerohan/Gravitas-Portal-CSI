//admin.js

//Require express and express-router
const express = require('express');
var router = express.Router();

//Require mongoose model
var User = require('../models/user.model');

//Checks if admin, only then allows to use the following functionalities
function adminCheck(req, res, next) {
    if (req.session.admin) {
        next();
    } else {
        res.redirect("/auth/adminLogin");
    }
}
router.use(adminCheck);

//View all users based on some filter, leave blank if none
router.get('/', (req, res) => {
    User.find({
        //Put conditions to filter, if any
    }, (err, docs) => {
        if (!err) {
            User.countDocuments({
                //Put conditions to filter counts, if any
            }, (err, counter) => {
                if (!err) {
                    res.render("admin/viewUsers", {
                        list: docs,
                        count: counter
                    });
                } else {
                    console.log(`/view - User.find/count - Error`)
                    res.send("Server Error");
                }
            });
        } else {
            res.send("Could not get user list.");
            console.log('Error in retrieving user list: ' + err);
        }
    }).sort({
        '_id': -1
    });
});

//Add user from admin panel
router.get('/add', (req, res) => {
    res.render("user/register");
});

//Post request
router.post('/add', (req, res) => {
    add(req, res);
});

//Delete user by id
router.get('/delete/:id', (req, res) => {
    User.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/admin');
        }
        else {
            console.log('Error in user delete: ' + err);
            res.send("Server error");
        }
    });
});

//Update user data from admin panel
router.get('/update/:id', (req, res) => {
    //TODO: write code for update
});

module.exports = router;
