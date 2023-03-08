const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name'],
    },
    username:{
        type: String,
        unique: [true],
        required: [true, 'Please enter your name'],
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
        validate: [validator.isEmail, 'invalid email']
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
    },
    role: {
        type: String,
        default: 'user'
    },
    created_at: {
        type: Date,
        immutable: true,
        default: Date.now
    }
});

userSchema.pre('save', async function(next){
    if(this.isNew){
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

userSchema.methods.checkPassword = async function(password){
    return await bcrypt.compare(password, this.password);
}
userSchema.methods.getToken = async function(){
    return jwt.sign({_id: this._id}, process.env.JWT_SECRET);
}

userSchema.statics.verifyToken = async function(token){
    try{
        const id = jwt.verify(token, process.env.JWT_SECRET)._id;
        return this.findById(id)
        .select({
            name: 1,
            email: 1,
            username: 1,
            password: 1,
            role: 1,
        });
    }catch(error){
        if(error.message === "invalid signature"){
            return false;
        }
    }
}

userSchema.statics.findByEmailOrUsername = function(info){
    return this.findOne({$or:[{email: info}, {username: info}]})
    .select({
        name: 1,
        email: 1,
        username: 1,
        password: 1,
        role: 1,
    });
}


userSchema.methods.changePassword = async function(newPassword, oldPassword){
    const isOldPassCorrect = await bcrypt.compare(oldPassword, this.password);
    if(isOldPassCorrect){
        this.password = await bcrypt.hash(newPassword, 10);
        await this.save();
        return true;
    }
    return false;
}


const User = mongoose.model('User', userSchema);

module.exports = User;