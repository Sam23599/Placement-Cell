// const Post = require('../models/post');

module.exports.home = async function (req, res) {

    console.log("inside home controller");
    
    return res.render('home', {
        title: 'PlaceMent Cell'
    });

    // try {
    //     const posts = await Post.find({})
    //         .sort('-createdAt')
    //         .populate('user')
    //         .populate({
    //             path: 'comments',
    //             populate: {
    //                 path: 'user'
    //             }
    //         });
            
    //     const users = await User.find({});
    //     return res.render('home', {
    //         title: 'CodeBook',
    //         posts: posts,
    //         all_users: users
    //     })

    // } catch (error) {
    //     console.log("unknow error on showing posts on home page");
    //     return;
    // }

}