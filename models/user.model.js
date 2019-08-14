//user.model.js

const mongoose = require('mongoose');

//Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    type: {
        type: String,
        required:true
    },
    payment_status: {
        type: String,
        required:true
    },
    mobile:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    event: {
        type:String
    }
});

var eventSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        index:true,
    },
    gravitasID:{
        type: String,
        required: true,
        unique: true,
        index: true,
    }
});

//Export the model
module.exports = mongoose.model('Event', eventSchema);

//Export the model
module.exports = mongoose.model('Participant', userSchema);
