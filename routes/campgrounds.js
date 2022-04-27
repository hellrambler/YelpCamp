const express = require('express');
const router = express.Router();
const campgrounds = require("../controllers/campgrounds");
const catchAsync = require("../utils/CatchAsync");
const {isLoggedIn, isAuthor, validateCampground} = require("../middleware");
const multer = require("multer");
const {storage} = require("../cloudinary");
const upload = multer({ storage: storage });

router.route('/')
    .get(catchAsync( campgrounds.index ))
    .post(isLoggedIn, 
        upload.array('image'),
        validateCampground, 
        catchAsync( campgrounds.createCampground ));


//create new campground - form
router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    .get(catchAsync( campgrounds.showCampground ))
    .put(isLoggedIn, 
        isAuthor, 
        upload.array("image"),
        validateCampground, 
        catchAsync( campgrounds.editCampground ))
    .delete(isLoggedIn, 
        isAuthor, 
        catchAsync( campgrounds.deleteCampground ));

//edit campground - form
router.get("/:id/edit", 
    isLoggedIn, 
    isAuthor, 
    catchAsync( campgrounds.renderUpdateForm ));

module.exports = router;