const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
    temperature_higher_limit : {
        type: Number
    },
    temperature_lower_limit : {
        type: Number
    },
    humidity_limit:{
        type: Number
    },
    fan_manual:{
        type: Boolean
    }
})

module.exports = mongoose.model('setting', settingSchema);