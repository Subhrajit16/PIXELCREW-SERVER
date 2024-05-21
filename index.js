require('dotenv').config();
const express = require("express");
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
require('./config/middleware'); 



const app = express();

app.use(passport.initialize());

const port = 50;

const { dbConnect } = require('./config/dbConnect')


app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});


//endpoints

var UserRoute = require('./Routes/User/userRoute');
var PostRoute = require('./Routes/post/PostRoute');

app.use('/api/user', UserRoute);
app.use('/api/posts', PostRoute);



dbConnect();
app.listen(port, () => {
    console.log(`Server running at ${port}`);
});
