const mongoose = require('mongoose');
const { Schema } = mongoose;

const GallerySchema = new Schema({
    img: String,
    title: String
}, { timestamps: true });

const gallery = mongoose.model('Galery' , GallerySchema);

module.exports = gallery;