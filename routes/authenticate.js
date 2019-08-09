//authenticate.js

//Require express and express-router
var express = require('express');
var router = express.Router();

//Set admin user-name and admin-password (Protect admin panel with recaptcha for security)
const adminUser = process.env.ADMIN_USERNAME || "temporary"; //Enter admin username
const adminPass = process.env.ADMIN_PASSWORD || "temporary"; //Enter admin password

//Import the User model
var User = require('../models/user.model');
var bcrypt = require('bcrypt');

//GET request at /auth/adminLogin
router.get("/adminLogin", function (req, res) {
    res.render("admin/authenticate");
});

//POST request at /auth/adminLogin
router.post("/adminLogin", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    if (username === adminUser && password === adminPass) {
        req.session.admin = true;
        res.redirect("/");
    } else {
        res.render("admin/authenticate", {
            wrong: true
        });
    }
});

//GET request at /auth/adminLogout
router.get("/adminLogout", function (req, res, next) {
    req.session.destroy(function () {
        res.redirect("/auth/adminLogin");
    });
});

//GET request at /auth/login
router.get("/login", (req, res) => {
    res.render("user/loginPage");
});

//POST request at /auth/login

router.post("/login", function (req, res) {
    const username = req.body.username.toString().trim();
    const password = req.body.password.toString().trim();
    if (username.length > 20 || password.length > 16) {
        res.send("Too large");
    } else {
        User.findOne({
            "name": username,
        }).then((doc) => {
            if (!doc) {
                res.render("user/loginPage", {
                    messages:true //Sample templating with hbs
                });
            } else{
                bcrypt.compare(password, doc.password, (err, result) => {
                    if (result === true) {
                        req.session.user = username;
                        res.redirect("/");
                    } else {
                        res.render("user/loginPage", {
                            messages:true //Sample templating with hbs
                        });
                    }
                });
            }
        });
    }
});

//GET request at /auth/logout
router.get("/logout", function (req, res, next) {
    req.session.destroy(function () {
        res.redirect("/");
    });
});

module.exports = router;
