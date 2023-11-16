const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

// passport strategy setup
passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
}, async function (req, email, password, done) {

    // find user and establish strategy
    console.log('Passport strategy --> strategy')
    try {
        const userId = await User.findOne({email: email});
        if(!userId || userId.password != password){
            req.flash('error', 'Invalid Username/Password');
            return done(null, false);
        }
        req.flash('success', 'User Authorized');
        return done(null, userId);

    } catch (error) {
        req.flash('error', error);
        return done(error);
    }
}
));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(async function(id, done){
    try {
        const userId = await User.findById(id);
        if(!userId){
            return done(null, false);
        }
        return done(null, userId);
    } catch (error) {
        return done(err, false);
    }
});

// Ensures that the user information is available globally in your views, and calling it in the main app file ensures it runs for every request after Passport processes the authentication
passport.setAuthenticatedUser =function(req, res, next){
    if(req.isAuthenticated()){
        // req.user contains the current signed in user from the session cookie

        // Updating/adding user for views
        res.locals.user = req.user;
    }
    next();
}

// check if the user is authenticated to perform restriced operations like add/delete/update user or students details
passport.checkAuthentication = function(req, res, next){
    if(req.isAuthenticated()){
        console.log('Authenticated');
        return next();
    }
    console.log('Not authorized. Redirecting to Login');
    return res.redirect('/auth/userAccess?userLogin=true');
}

module.exports = passport;