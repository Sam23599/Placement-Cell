module.exports.home = async function (req, res) {

    console.log("inside home controller");
    
    return res.render('home', {
        title: 'PlaceMent Cell'
    });
}