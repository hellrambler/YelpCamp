const express = require("express");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utils/CatchAsync");
const ExpressErorr = require("../utils/ExpressError");
const passport = require('passport');

//register routes
router.get('/register', (req, res) => {
    res.render("users/register");
});

router.post("/register", catchAsync(async (req, res, next) => {
    try {
        const {username, password, email} = req.body;
        const user = new User({username, email});
        const registeredUser = await User.register(user, password);
        console.log(registeredUser);
        req.flash("success", "Welcome to Yelp Camp!");
        res.redirect("/campgrounds");
    } catch(err) {
        req.flash("error", err.message);
        res.redirect("/register");
    }
}));

//login routes
router.get("/login", (req, res) => {
    res.render("users/login");
});

router.post("/login", passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: 'login'
}) , (req, res) => {
    req.flash("success", "Welcome back!");
    res.redirect("/campgrounds")
});

//logout
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Goodbye!");
    res.redirect("/campgrounds");
})

module.exports = router;