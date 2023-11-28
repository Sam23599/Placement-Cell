module.exports.home = async function (req, res) {

    console.log("inside home controller");
    return res.render('home', {
        title: 'PlaceMent Cell'
    });
}

module.exports.students = async function(req, res){
    console.log("inside students controller");
    return res.render('students', {
        title: "Students"
        });
}

module.exports.interviews = async function (req, res){
    console.log("inside interviews controller");
    return res.render('interviews', {
        title: "Interviews"
        });
}