const User = require('../../models/User');

async function login(req, res){
    if(!req.user){
        const {username, email, password} = req.body;
    
        let user;
    
        // Checking if user whats to use username or email as login credentials
        if(username){
            user = await User.findByEmailOrUsername(username);
        }
        
        if(email && !user){
            user = await User.findByEmailOrUsername(username);
        }
    
        if(user){
            const isPasswordCorrect = await user.checkPassword(password) 
            if(isPasswordCorrect){
                const token = await user.getToken();
                res.cookie('token', token, {maxAge: (7 * 24 * 60 * 60 * 1000), httpOnly: true } ).redirect('/dashboard');
            }else{
                res.render('login', {error: "Incorrect Password"});
            }
        }else{
            res.render('login', {error: "User Not Found"});
        }      
    }
}


module.exports = login