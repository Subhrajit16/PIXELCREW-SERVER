const UserModel = require('../../Model/User/userModel');
const mongoose = require('mongoose');
const { GenerateSalt, GeneratePassword, } = require('../../config/authHandeler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const uploadOnCloudinary = require('../../config/cloud');

const CreateUser = async (req, res) => {
    // console.log("object", req.body)
    // return
    try {
        const { username, fullname, avatar, email, mobile, password, bio, address, role, } = req.body;

        const preuser = await UserModel.findOne({ email: email });

        if (preuser) {
            return res.status(422).json("This user is already present");
        }

        const salt = await GenerateSalt();
        const hashedPassword = await GeneratePassword(password, salt);

        const newUser = new UserModel({
            username,
            fullname,
            avatar,
            email,
            mobile,
            password: hashedPassword,
            bio,
            address,
            role,

        });
        await newUser.save();
        res.status(201).json({ newUser });

    } catch (error) {
        res.status(422).json(error);

    }
};

const GetAll = async (req, res) => {
    try {
        const userdata = await UserModel.find();
        res.status(200).json(userdata);
    }
    catch (error) {
        res.status(500).json({ error: 'failed to show all data!' })
    }
}

const Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await UserModel.findOne({ email: email });
        if (!user) {
            return res.status(401).json({ error: "Invalid email id / email does not exist" });
        }

        // Check if the user is active
        if (!user.isactive) {
            return res.status(422).json({ error: "User is not active. Cannot login, Please contact your Admin" });
        }

        const validatePassword = await bcrypt.compare(password, user.password);
        if (!validatePassword) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1D' });
        res.status(200).json({ user, token });
    } catch (error) {
        res.status(500).json({ error: "Failed to login", details: error.message });
    }
};


const GetbyId = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await UserModel.find({ _id: id });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: "user not found", details: error.message })
    }
};
const UpdateAvatar = async(req,res) =>{
    const {id} =req.params;
    try {
        const users = await UserModel.findOne({_id:id});
        if(!users){
            res.status(404).json({error:"user Not found"});
        }

        const AvatarUpdate = await uploadOnCloudinary(req.files.avatar[0].path);
        users.avatar = AvatarUpdate.url;

        await users.save();
        res.status(200).json(AvatarUpdate.url)
    } catch (error) {
        res.status(500).json({error:"error while updating."})
    }
}
const Update = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullname, mobile, bio, address,role,isactive } = req.body;
               
        const user = await UserModel.findById(id);
        if (!user) {
            return res.status(404).json({ error: "user not found" });
        }

        user.fullname = fullname || user.fullname;
        user.mobile = mobile || user.mobile;
        user.bio = bio || user.bio;
        user.address = address || user.address;
        user.role = role || user.role;
        user.isactive = isactive !== undefined ? isactive : user.isactive;
        
        await user.save();
        res.status(200).json({ message: "user updated successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to update user", details: error.message });
    }
};
const GetuserCounts = async (req, res) => {
    try {
        const activeCount = await UserModel.countDocuments({ isactive: true });
        const inactiveCount = await UserModel.countDocuments({ isactive: false });
        const totalCount = await UserModel.countDocuments({}); 

        res.status(200).json({ activeCount, inactiveCount, totalCount });
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve counts", details: error.message });
    }
};
module.exports = { CreateUser, GetAll, Login, GetbyId ,UpdateAvatar ,Update ,GetuserCounts};