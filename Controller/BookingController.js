const ProductModel = require('../Model/ProductModel');
const BookingModel = require('../Model/BookingModel');
const NotificationModel = require('../Model/NotificationModel');
const UserModel = require('../Model/User/userModel');
const razorpayInstance =require('../config/razorPay');
const crypto = require('crypto');

const Insert = async (req, res) => {
    try {
        const { productId, date } = req.body;
        const userId = req.user?._id;

        // Check if the product exists
        const product = await ProductModel.findById(productId);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        // Check if the product is available on the specified date
        const existingBooking = await BookingModel.findOne({ productId, date });
        if (existingBooking) {
            return res.status(400).json({ error: "Product not available on this date" });
        }

        // Fetch user details
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Create a new booking
        const newBooking = new BookingModel({ userId, productId, date ,totalAmount:product.price });
        await newBooking.save();

        // Create a notification message with user and product details
        const notificationMessage = `Thank you! ${user?.username},You have booked ${product?.name} on ${date} . your booking will be approved soon.`;
        const newNotification = new NotificationModel({ message: notificationMessage ,userId:userId });
        await newNotification.save();

        res.status(201).json("Booking successful");
    } catch (error) {
        res.status(500).json({ error: "Failed to create booking", details: error.message });
    }
};



const GetAll = async (req, res) => {
    try {
        const data = await BookingModel.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'productId',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $unwind: '$product'
            },
            {
                $project: {
                    _id: 1,
                    userId: 1,
                    productId: 1,
                    date: 1,
                    status: 1,
                    totalAmount:1,
                    dueAmount: 1,
                    paidAmount: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    'user.username': 1,
                    'user.fullname': 1,
                    'user.email': 1,
                    'product.name': 1,
                    'product.price': 1
                }
            },
            {
                $sort: { createdAt: -1 }
            }
        ]);

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Error fetching data" });
    }
};


const GetByID = async (req, res) => {
    try {
        const { id } = req.params;
        const Data = await BookingModel.find({ _id: id })
        .populate({
            path: 'userId',
            select: 'username fullname email mobile'
        })
        .populate({
            path: 'productId',
            select: 'name details'
        });
        res.status(200).json(Data);
    } catch (error) {
        res.status(500).json({ error: "Failed to show Data", details: error.message });
    }
};

const Update = async (req, res) => {
    try {
        const { id } = req.params;
        const {amount,mode} = req.body;

        const Data = await BookingModel.findOneAndUpdate({ _id: id });
        if (!Data) {
            return res.status(404).json({ error: "Data not found" });
        }
        if (Data.totalAmount === Data.paidAmount) {
            return res.status(400).json({ error: 'Fees  is Totally paid' });
        }
        const Total = Data.paidAmount + amount;
        const Due = Data.totalAmount - Total;

        Data.BillSummary.push({
            recivedAmount: amount,
            payVia: mode,
            Date: Date.now() 
        });

        Data.paidAmount =Total;
        Data.dueAmount =Due;

        const updatedData = await Data.save();
        res.status(200).json({ message: "Data updated successfully" ,updatedData});
    } catch (error) {
        res.status(500).json({ error: "Failed to delete Data", details: error.message });
    }
};
const Delete = async (req, res) => {
    try {
        const { id } = req.params;
        const Data = await BookingModel.findOneAndDelete({ _id: id });
        if (!Data) {
            return res.status(404).json({ error: "Data not found" });
        }
        res.status(200).json({ message: "Data deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete Data", details: error.message });
    }
};

const UpdateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Check if the booking exists
        const booking = await BookingModel.findById(id);
        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }

        // Update the status
        booking.status = status;
        await booking.save();

        // Fetch user and product details
        const user = await UserModel.findById(booking.userId);
        const product = await ProductModel.findById(booking.productId);

        if (!user || !product) {
            return res.status(404).json({ error: "User or product not found" });
        }

        // Create notification message
        let notificationMessage;
        if (status === 'Approved') {
            notificationMessage = `${user.username}, your booking for ${product.name} has been approved.`;
        }
        else if (status === 'Pending') {
            notificationMessage = ` ${user.username}, your booking for ${product.name} is Pending will be approved soon. Thank you.`;
        } else if (status === 'Declined') {
            notificationMessage = `Sorry to inform you, ${user.username}, your booking for ${product.name} is not approved. Thank you.`;
        } else {
            return res.status(400).json({ error: "Invalid status" });
        }

        // Save notification
        const newNotification = new NotificationModel({ message: notificationMessage,userId:booking.userId });
        await newNotification.save();

        res.status(200).json({ message: "Booking status updated successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to update booking", details: error.message });
    }
};
const GetBookingCounts = async (req, res) => {
    try {
        const ApprovedCount = await BookingModel.countDocuments({ status: "Approved" });
        const PendingCount = await BookingModel.countDocuments({ status: "Pending" });
        const totalCount = await BookingModel.countDocuments({}); 

        res.status(200).json({ ApprovedCount, PendingCount, totalCount });
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve counts", details: error.message });
    }
};
const GetByUserID = async (req, res) => {
    try {
        const Id = req.user?._id;
        const Data = await BookingModel.find({ userId: Id }).sort({ createdAt: -1 })
        .populate({
            path: 'productId',
            select: 'name details'
        });
        res.status(200).json(Data);
    } catch (error) {
        res.status(500).json({ error: "Failed to show Data", details: error.message });
    }
};
const createOrder = async (req, res) => {
    try {
        const { bookingId, amount, currency } = req.body;

        const booking = await BookingModel.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }

        const options = {
            amount: amount * 100, 
            currency,
            receipt: bookingId.toString(),
        };

        const order = await razorpayInstance.orders.create(options);

        res.status(201).json({ orderId: order.id });
    } catch (error) {
        res.status(500).json({ error: "Failed to create Razorpay order", details: error.message });
    }
};
const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

        // Validate the signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ error: "Invalid signature" });
        }

        // Update the booking status and payment details
        const booking = await BookingModel.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }

        booking.paidAmount = booking.totalAmount; 
        booking.dueAmount = 0;
        booking.BillSummary.push({
            recivedAmount: booking.totalAmount,
            payVia: 'Razorpay',
            Date: new Date()
        });

        await booking.save();

        res.status(200).json({ message: "Payment verified and booking updated successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to verify payment", details: error.message });
    }
};
module.exports = { Insert, GetAll, GetByID, Update, Delete ,UpdateStatus ,GetBookingCounts ,GetByUserID ,createOrder,verifyPayment};