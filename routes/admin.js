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
    const filter=req.query;
    if (filter.event === "any") {
        delete filter.event;
    }

    if (filter.payment_status === "any") {
        delete filter.payment_status;
    }

    User.aggregate([
        {
            $lookup: {
                from: "events",
                localField: "event",
                foreignField: "gravitasID",
                as: "eventInfo"
            }
        },
        {
            $project: {
                name: 1,
                email: 1,
                mobile: 1,
                payment_status: 1,
                event: '$eventInfo.name'
            }
        },
        {
            $match: filter
        }
    ], (err, result) => {
        res.render("admin/viewUsers", {
            list: result,
            count: result.length
        });
    })
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
