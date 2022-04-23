const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require("../utils/CatchAsync");
const ExpressErorr = require("../utils/ExpressError");
const {reviewSchema} = require('../schemas');
const Review = require("../models/review");
const Campground = require("../models/campground");

const validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressErorr(msg, 400);
    } else {
        next();
    }
}

router.post("/", validateReview, catchAsync(async (req, res, next) => {
    const camp = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    req.flash("success", "Successfully created a review.")
    res.redirect(`/campgrounds/${camp._id}`)
}));

router.delete("/:reviewId", catchAsync(async(req, res, next) => {
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted a review.")
    res.redirect(`/campgrounds/${id}`)
}));

module.exports = router;