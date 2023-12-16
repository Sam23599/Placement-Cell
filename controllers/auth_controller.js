const User = require('../models/user');

module.exports.userForm = function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    return res.render('sign_in', {
        title: 'Sign in'
    });
}

module.exports.signUp = async function (req, res) {
    // is user loged in with cookie then redirect to home
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }

    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            console.log('Creating account');

            // Set the default avatar path
            const defaultAvatarPath = '/images/Empty-avatar.jpg';
            const actualAvatarPath = path.join(__dirname, '..', '/assets/images/Empty-avatar.jpg')
            console.log(actualAvatarPath);

            // Create a new user with the default avatar path
            await User.create({
                ...req.body,
                avatarPath: actualAvatarPath,
            });
        }
        else {
            console.log('Account already exists with the same email. Login instead');
        }

        return res.redirect('/auth/userAccess?userLogin=true');
    } catch (error) {
        console.log('Error in signing up: ', error);
        return;
    }
}

module.exports.login = async function (req, res) {
    // authentication is done by passport 
    // So no need of checks here, just setup cookie

    const user = await User.findOne({ email: req.body.email });
    res.cookie('mentorUser_id', user._id);    // set cookie

    // if user loged-in (in cookie) then redirect to home
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }

    return res.redirect('/');
}

module.exports.signOut = function (req, res) {
    console.log('Signin out');

    const cookies = req.cookies;
    Object.keys(cookies).forEach(cookieName => {
        res.clearCookie(cookieName);   // clear all cookies
    });

    req.session.cookie.expires = new Date();
    req.session.cookie.maxAge = 0;

    req.logout(function (err) {
        if (err) {
            console.log("Logging out failed: ", err);
        }
    })

    return res.redirect('/');


}