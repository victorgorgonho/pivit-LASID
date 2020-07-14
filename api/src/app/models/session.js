const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SessionSchema = new mongoose.Schema({
    userId: {
        type: String,
        ref: 'User',
        required: true,
    },
    userEmail:{
        type: String,
        ref: 'User',
        required: true,
    },
    token:{
        type: String,
        required: true,
    },
    active:{
        type: Boolean,
        required: true,
    },
    createdAt:{
        type: Date,
        default: Date.now,
    },
});

const Session = mongoose.model('Session', SessionSchema);

module.exports = Session;