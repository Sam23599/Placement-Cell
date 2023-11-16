const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const User = require('../models/user');

let opts = {
    jwtFromRequest : ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'dragonspine'
}

passport.use(new JWTStrategy(opts, async function(jwtPayload, done){
    try {
        const user = User.findById(jwtPayload._id);
        if(user){
            return done(null, user);
        }
        else{
            return done(null, false);
        }
    } catch (error) {
        console.log("Error in finding user from JWT");
        return;
    }
}))

module.exports = passport;