const mongoose = require('mongoose');
const {Schema} = mongoose;

const ContactSchema = new Schema({
    firstName:{type:String},
    lastName:{type:String},
    emailId:{type:String},
    MobileNo:{type:Number},
    Message:{type:String},
},{ timestamps: true },);

const contact = mongoose.model('contactus',ContactSchema);
module.exports =contact;