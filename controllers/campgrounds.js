const Campground = require("../models/campground");
const {cloudinary} = require("../cloudinary");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const mbxClient = require('@mapbox/mapbox-sdk/services/geocoding');

const geocoder = mbxClient({
    accessToken: mapBoxToken
});

module.exports.index = async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
};

module.exports.renderNewForm =  (req, res) => {
    res.render("campgrounds/new");
};

module.exports.createCampground = async (req, res, next) => {

    const geoResponse = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();

    const campground = new Campground(req.body.campground);
    campground.geometry = geoResponse.body.features[0].geometry;
    campground.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    campground.author = req.user._id;

    await campground.save();

    req.flash("success", "Successfully created a new campground.")
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground = async (req, res, next) => {
    const {id} = req.params;
    const camp = await Campground.findById(id).populate({
        path:"reviews",
        populate: {
            path: "author"
        }
    }).populate("author");
    if (!camp) {
        req.flash("error", "The campground does not exist.");
        return res.redirect("/campgrounds");
    } else {
        res.render("campgrounds/show", {camp} );
    }
};

module.exports.renderUpdateForm = async (req, res, next) => {
    const {id} = req.params;
    const camp = await Campground.findById(id);

     if (!camp) {
        req.flash("error", "The campground does not exist.");
        res.redirect("/campgrounds");
    }

    res.render("campgrounds/edit", {camp});
    
};

module.exports.editCampground = async (req, res, next) => {
    const {id} = req.params;
    console.log(req.body);
    const camp = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    camp.images.push(...imgs);
    await camp.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await camp.updateOne({$pull: {images: {filename : {$in: req.body.deleteImages}}}});
    }
    req.flash("success", `Successfully updated ${camp.title}.`)
    res.redirect(`/campgrounds/${camp._id}`);
};

module.exports.deleteCampground = async (req, res, next) => {
    const {id} = req.params;
    const deletedCamp = await Campground.findByIdAndDelete(id);
    req.flash("success", `Successfully deleted ${deletedCamp.title}.`)
    res.redirect("/campgrounds");
}