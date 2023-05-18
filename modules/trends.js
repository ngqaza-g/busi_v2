const Data = require('../models/Data');

const trends = async(req, res) =>{

    if(req.user){
        let data = await Data.find();
        const lastRecordedValue = data[data.length-1];
        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setDate(twentyFourHoursAgo.getDate() -1);
        const last24HoursData = data.filter(d => d.created_at > twentyFourHoursAgo && d.created_at <= lastRecordedValue.created_at);
        const temperature = last24HoursData.map(d => ( { y: d.temperature, x: d.created_at}));
        const humidity = data.map(d => ( { y: d.humidity, x: d.created_at}));
        res.json({temperature, humidity});
    }else{
        res.status(401).json({error: "Invalid user"});
    }
}

module.exports = trends;