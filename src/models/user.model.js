const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true
    },
    payment_status: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    event: {
        type: String
    }
});

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    gravitasID: {
        type: String,
        required: true,
        unique: true,
        index: true,
    }
});

module.exports = {
    User: mongoose.model('Participant', userSchema),
    Event: mongoose.model('Event', eventSchema),
}
