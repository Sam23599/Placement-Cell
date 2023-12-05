const User = require('../models/user');
const fs = require('fs');
const path = require('path');

module.exports.profile = async function (req, res) {

    try {
        const profile_user = await User.findById(req.params.id);
        if (profile_user) {
            return res.render('profile', {
                title: 'User Profile',
                profile_user: profile_user
            });
        }
        else {
            console.log("Profile not found");
            return res.redirect('/auth/sign-in');
        }
    } catch (error) {
        console.log('Error in session: ', error);
        return;
    }

}

module.exports.profileUpdate = async function (req, res) {

    // required 'if' so that one user cannot modiy other user details
    if (req.user.id == req.params.id) {
        try {
            const user = await User.findById(req.params.id);

            // bit confused how this actually works but it updates req.body after this with user details
            // Multer handles field: 'avatar' file upload, populates `req.file` with uploaded file details.
            await new Promise((resolve, reject) => {
                User.uploadedFile(req, res, (err) => {
                    if (err) {
                        console.log('Multer Error in user controller', err);
                        reject(err);
                    }
                    else {
                        resolve();
                    }
                })
            });

            user.username = req.body.name;
            user.email = req.body.email;
            user.password = req.body.password;

            if (req.file) {
                if (user.avatarPath == "/images/Empty-avatar.jpg") {
                    // if default avatar in /assets/images, then dont delete it, just update destination of new avatar
                }
                else if (user.avatarPath) {
                    console.log('file dest: /')
                    // if avatar is in /uploads/ then delete old avatar
                    fs.unlinkSync(path.join(__dirname, '..', user.avatarPath));
                }
                user.avatarPath = User.filePath + '/' + req.file.filename;
            }

            await user.save();

            return res.redirect('back');

        } catch (error) {
            console.log('Error: Updating user in user_controller')
            return res.redirect('back');
        }

    } else {
        console.log('Error: Unauthorized');
        return res.status(401).send('Unauthorized');
    }
}