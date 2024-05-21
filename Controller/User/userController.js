const UserModel = require('../../Model/User/userModel');
const mongoose = require('mongoose');
const { GenerateSalt, GeneratePassword, } = require('../../config/authHandeler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const CreateUser = async (req, res) => {

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
            password:hashedPassword,
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

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
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

module.exports = { CreateUser, GetAll ,Login };