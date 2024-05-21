const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  username: { type: String , },
  avatar: { type: String },
  fullname: { type: String },
  email: { type: String, unique: true, required: true },
  mobile: { type: String },
  password: { type: String },
  isactive: {
    type: Boolean,
    default: true
  },
  bio: { type: String },
  address: { type: String },
  role: {
    type: String,
    default: "user"
  },


});

const users = mongoose.model('user', UserSchema);
module.exports = users;