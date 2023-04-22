const Data = require('../models/Data');

const trends = async(req, res) =>{

    if(req.user){
        const data = await Data.find();
        const temperature = data.map(_data => ( { y: _data.temperature, x: _data.created_at}));
        const humidity = data.map(_data => ( { y: _data.humidity, x: _data.created_at}));
        res.json({temperature, humidity});
    }else{
        res.status(401).json({error: "Invalid user"});
    }
}

module.exports = trends;