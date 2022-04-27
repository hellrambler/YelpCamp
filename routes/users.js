const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/CatchAsync");
const ExpressErorr = require("../utils/ExpressError");
const passport = require('passport');
const users = require("../controllers/users");

//register
router.route("/register")
    .get(users.renderRegisterForm)
    .post(catchAsync( users.register ));

//login form
router.route("/login")
    .get(users.renderLoginForm)
    .post(passport.authenticate('local', {
        failureFlash: true,
        failureRedirect: 'login'
    }) , users.login);

//logout
router.get("/logout", users.logout)

module.exports = router;