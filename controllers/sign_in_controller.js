module.exports.signin = async function (req, res){
    
    console.log('inside signin controller');

    return res.render('sign_in', {
        title : 'User SignUp'
    });
}