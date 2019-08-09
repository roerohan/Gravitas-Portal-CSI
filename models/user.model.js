//user.model.js

const mongoose = require('mongoose');

//Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        index:true,
    },
    type: {

    },
    payment_status: {

    },
    mobile:{
        type:String,
        required:true,
        unique:true,
        index:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        index:true,
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
