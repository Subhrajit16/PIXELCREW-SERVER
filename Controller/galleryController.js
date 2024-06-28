const GalleryModel = require('../Model/galleryModel');
const uploadOnCloudinary = require('../config/cloud');

const Insert = async (req, res) => {
    try {
        const imageResponse = await uploadOnCloudinary(req.files?.img[0].path);

        const { title } = req.body;

        const NewUpload = new GalleryModel({
            img: imageResponse?.url,
            title
        })
        await NewUpload.save();
        res.status(200).json({ message: "Image Upload Successful", NewUpload })
    } catch (error) {
        res.status(500).json({ error })
    }
};

const GetAll = async (req, res) => {
    try {
        const Data = await GalleryModel.find().sort({ createdAt: -1 });
        if (!Data) {
            res.status(400).json({ error: "No Image found in Gallery" });
        } else {
            res.status(200).json(Data);
        }

    } catch (error) {
        res.status(500).json({ error })
    }
};

const GetByID= async(req,res) =>{
    try {
        const {id} = req.params;
        const  Data = await GalleryModel.findOne({_id:id});
        res.status(200).json(Data);
    } catch (error) {
        res.status(500).json(error);
    }
};

const Delete = async(req,res) =>{
    try {
        const {id} =req.params;
        const Data = await GalleryModel.findByIdAndDelete(id);
        res.status(200).json(Data)
    } catch (error) {
        res.status(500).json(error)
    }
};

module.exports = { Insert ,GetAll,GetByID,Delete};