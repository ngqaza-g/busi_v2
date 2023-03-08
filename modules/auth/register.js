const User = require('../../models/User');
const error_msg = require('../error_message');

async function register(req, res, next){
    if(!req.user){
        const {name, username, email, password} = req.body;
        try{
            await User.create({
                name,
                username, 
                email,
                password
            });
            next();
        }catch(error){
            res.render('dashboard', {error: error_msg(error)});
        }
    }
}


module.exports = register