const NotificationModel = require('../Model/NotificationModel');

const Insert = async (req, res) => {

    try {
        const { message } = req.body;

        const newdata = new NotificationModel({
            message
        });
        await newdata.save();
        res.status(201).json("New Data Created");
    } catch (error) {
        res.status(500).json({ error: "failed to create Data" });
    }
};


const GetAll = async (req, res) => {
    try {
        const [data, count] = await Promise.all([
            NotificationModel.find().sort({ createdAt: -1 }),
            NotificationModel.countDocuments()
        ]);

        res.status(200).json({ notifications: data, notificationCount: count });
    } catch (error) {
        res.status(500).json({ error: "Error fetching data and counting notifications", details: error.message });
    }
};

const GetByID = async (req, res) => {
    try {
        const Id = req.user?._id;
        const [notifications, notificationCount] = await Promise.all([
            NotificationModel.find({ userId: Id }).sort({ createdAt: -1 }),
            NotificationModel.countDocuments({ userId: Id })
        ]);

        res.status(200).json({ notifications, notificationCount });
    } catch (error) {
        res.status(500).json({ error: "Failed to show Data", details: error.message });
    }
};



const Update = async (req, res) => {
    try {
        const { id } = req.params;
        const Data = await NotificationModel.findOneAndUpdate({ _id: id });
        if (!Data) {
            return res.status(404).json({ error: "Data not found" });
        }
        res.status(200).json({ message: "Data Updated successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete Data", details: error.message });
    }
};
const Delete = async (req, res) => {
    try {
        const { id } = req.params;
        const Data = await NotificationModel.findOneAndDelete({ _id: id });
        if (!Data) {
            return res.status(404).json({ error: "Data not found" });
        }
        res.status(200).json({ message: "Data deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete Data", details: error.message });
    }
};

const GetCount = async (req, res) => {
    try {
        const count = await NotificationModel.countDocuments();
        res.status(200).json({ notificationCount: count });
    } catch (error) {
        res.status(500).json({ error: "Error counting notifications", details: error.message });
    }
};
module.exports = {Insert,GetAll,GetByID,Update,Delete,GetCount};