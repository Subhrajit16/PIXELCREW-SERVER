require('dotenv').config();
const express = require("express");
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const server = express()
const mongoose = require('mongoose');
const passport = require('passport');
require('./config/authorization');


app.use(cors({
    origin: ['http://localhost:3000', 'https://pixelcrew-web.vercel.app'],
    credentials: true
}));

app.use(bodyParser.json());

app.use(passport.initialize());


const port = 50;

const { dbConnect } = require('./config/dbConnect')


app.use(express.json());



//endpoints
var ContactRoute = require('./Routes/Contacus/contactUsRoute');
var UserRoute = require('./Routes/User/userRoute');
var PostRoute = require('./Routes/post/PostRoute');
var ProductRoute = require('./Routes/ProductRoute');
var BookingRoute = require('./Routes/BookingRoute');
var NotificationRoute = require('./Routes/NotificationRoute');
var GalleryRoute = require('./Routes/galleryRoutes');



app.use('/api/contactus', ContactRoute);
app.use('/api/user', UserRoute);
app.use('/api/posts', PostRoute);
app.use('/api/product', ProductRoute);
app.use('/api/booking',BookingRoute);
app.use('/api/notified',NotificationRoute);
app.use('/api/gallery',GalleryRoute);



app.get('/', (req, res) => {
    res.send('Hello World!');
});

dbConnect();
app.listen(port, () => {
    console.log(`Server running at ${port}`);
});
