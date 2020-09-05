const express = require('express');
const router = express.Router();

const adminUser = process.env.ADMIN_USERNAME || "temporary";
const adminPass = process.env.ADMIN_PASSWORD || "temporary";

router.get("/adminLogin", function (req, res) {
    res.render("admin/authenticate");
});

router.post("/adminLogin", function (req, res) {
    let { username, password } = req.body;
    username = username.toString();
    password = password.toString();

    if (username === adminUser && password === adminPass) {
        req.session.admin = true;
        res.redirect("/");
    } else {
        res.render("admin/authenticate", {
            wrong: true
        });
    }
});

router.get("/adminLogout", function (req, res, next) {
    req.session.destroy(function () {
        res.redirect("/auth/adminLogin");
    });
});

module.exports = router;
