const User = require("../models/user");

module.exports.renderRegisterForm = (req, res) => {
    res.render("users/register");
}

module.exports.register = async (req, res, next) => {
    try {
        const {username, password, email} = req.body;
        const user = new User({username, email});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) {
                return next(err);
            } else {
                req.flash("success", "Welcome to Yelp Camp!");
                res.redirect("/campgrounds");
            }
        });
    } catch(err) {
        req.flash("error", err.message);
        res.redirect("/register");
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login");
};

module.exports.login = (req, res) => {
    req.flash("success", "Welcome back!");
    const redirectedUrl = req.session.returnTo || "/campgrounds";
    delete req.session.returnTo;
    res.redirect(redirectedUrl)
};

module.exports.logout = (req, res) => {
    req.logout();
    req.flash("success", "Goodbye!");
    res.redirect("/campgrounds");
};