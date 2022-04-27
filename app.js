if (process.env.NODE_ENV !== "productions"){
    require("dotenv").config();
}

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require('passport');
const LocalStrategy = require("passport-local");

const Campground = require("./models/campground");
const Review = require("./models/review");
const User = require("./models/user");

const ExpressErorr = require("./utils/ExpressError");
const {campgroundSchema, reviewSchema} = require('./schemas');

//campground routes
const campgroundsRoutes = require("./routes/campgrounds");

//review routes
const reviewsRoutes = require("./routes/reviews");

//user routes
const usersRoutes = require("./routes/users");

//connect to mongodb
async function connect() {
  await mongoose.connect('mongodb://localhost:27017/yelp-camp');
}

connect()
    .then(()=> console.log("Successfully connected"))
    .catch(err => console.log(err));


const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "views"));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const sessionConfig = {
    secret: "thisisasecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
};
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    // console.log(req.session);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

//campgrounds router
app.use("/campgrounds", campgroundsRoutes);
//reviews router
app.use("/campgrounds/:id/reviews", reviewsRoutes);
//users router
app.use("/", usersRoutes);


// get home page
app.get("/", (req, res) => {
    res.render("home");
});


// when other routes above are not mapped
app.all("*", (req, res, next) => {
    next(new ExpressErorr("Page Not Found!", 404));
});

app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if (!err.message) {
        err.message = "Unknown Error!";
    }
    res.status(statusCode).render('error', {err});
});

app.listen(3000, () => {
    "Listening to port 3000";
});