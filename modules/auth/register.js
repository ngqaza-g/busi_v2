const User = require('../../models/User');
const error_msg = require('../error_message');

async function register(req, res, next){
    if(req.user && req.user.role === "admin"){
        const {name, username, email, password} = req.body;
        try{
            await User.create({
                name,
                username, 
                email,
                password
            });
            res.render('register', {error: null, user: req.user, success : "User registered"});
        }catch(error){
            res.render('register', {error: error_msg(error), success : null, user: req.user});
        }
    }
}


module.exports = register