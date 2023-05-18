const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    temperature:{
        type: Number,
        required: [true, "Please provide value for temperature"]
    },
    humidity:{
        type: Number,
        required: [true, "Please provide value for humidity"]
    },
    smoke:{
        type: Boolean,
        required: [true, "Please provide value for smoke"]
    },
    created_at: {
        type: Date,
        immutable: true,
        default: Date.now
    }
});

const Data = mongoose.model('data', dataSchema);


module.exports = Data;