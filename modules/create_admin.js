const User = require("../models/User");


async function create_admin(){
    try{
        await User.create({
            name: "Admin",
            username: "admin",
            email:"admin@somewhere.com",
            password:"admin",
            role: "admin"
        })
    }catch(e){
        console.log("Admin already exist");
    }
}

module.exports = create_admin;