const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require("../utils/CatchAsync");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware");
const reviews = require("../controllers/reviews");

//create
router.post("/", 
    isLoggedIn, 
    validateReview, 
    catchAsync( reviews.createReview ));

//delete
router.delete("/:reviewId", 
    isLoggedIn, 
    isReviewAuthor, 
    catchAsync( reviews.deleteReview ));

module.exports = router;