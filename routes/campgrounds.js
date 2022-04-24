const express = require('express');
const router = express.Router();
const catchAsync = require("../utils/CatchAsync");
const ExpressErorr = require("../utils/ExpressError");
const Campground = require("../models/campground");
const {campgroundSchema} = require('../schemas');
const {isLoggedIn} = require("../middleware");

const validateCampground = (req, res, next) => {
    const {error} = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressErorr(msg, 400);
    } else {
        next();
    }
}

router.get("/", catchAsync( async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
}));

router.post("/", isLoggedIn, validateCampground, catchAsync( async (req, res, next) => {
    
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash("success", "Successfully created a new campground.")
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.get("/new", isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

router.get("/:id", catchAsync( async (req, res, next) => {
    const {id} = req.params;
    const camp = await Campground.findById(id).populate("reviews");
    if (!camp) {
        req.flash("error", "The campground does not exist.");
        res.redirect("/campgrounds");
    } else {
        res.render("campgrounds/show", {camp} );
    }
}));

router.put("/:id", isLoggedIn, validateCampground, catchAsync( async (req, res, next) => {
    const {id} = req.params;
    const camp = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    req.flash("success", `Successfully updated ${camp.title}.`)
    res.redirect(`/campgrounds/${id}`);
}));

router.delete("/:id", isLoggedIn, catchAsync( async (req, res, next) => {
    const {id} = req.params;
    const deletedCamp = await Campground.findByIdAndDelete(id);
    req.flash("success", `Successfully deleted ${deletedCamp.title}.`)
    res.redirect("/campgrounds");
}));

router.get("/:id/edit", isLoggedIn, catchAsync( async (req, res, next) => {
    const {id} = req.params;
    const camp = await Campground.findById(id);
     if (!camp) {
        req.flash("error", "The campground does not exist.");
        res.redirect("/campgrounds");
    } else {
        res.render("campgrounds/edit", {camp});
    }
}));

module.exports = router;