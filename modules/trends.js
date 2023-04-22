const Data = require('../models/Data');

const trends = async(req, res) =>{
    const data = await Data.find();
    console.log(data);
}