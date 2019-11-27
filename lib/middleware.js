module.exports = {
    requireLogin: (req, res, next) => {
        if(req.user) {
            next();
        } else {
            res.redirect('/login');
        }
    },

    requireAdmin: (req, res, next) => {
        if(req.user && req.user.isAdmin) {
            next();
        } else {
            // Show them an error message and then send them home
            req.flash("info", "Sorry, this is an admin-only resource.");
            res.redirect('/');
        }
    }
};