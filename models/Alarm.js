const mongoose = require('mongoose');



const alarmSchema = new mongoose.Schema({
    alarm : {
        type: String,
        requred: [true, "Please describe the alarm event"]
    },
    created_at: {
        type: Date,
        immutable: true,
        default: Date.now
    }
});


const Alarm = mongoose.model('alarm', alarmSchema);

module.exports = Alarm