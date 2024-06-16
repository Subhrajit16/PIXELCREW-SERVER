const mongoose = require('mongoose');
const { Schema } = mongoose;

const PostSchema = new Schema({
  title: { type: String, required: true, trim: true },
  body: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  thumbnail:{type:String},
  images: [String],
  isActive: { type: Boolean, default: true },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  likes:[{type: Schema.Types.ObjectId, ref: 'user'}],
  comments:[
      {
          user: {type: Schema.Types.ObjectId, ref: 'user'},
          comment: String,
          date: {type: Date, default: Date.now}
      }
  
  ]
}, { timestamps: true });

const Post = mongoose.model('Post', PostSchema);
module.exports = Post;
