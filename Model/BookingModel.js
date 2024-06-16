const mongoose = require('mongoose');
const { Schema } = mongoose;

const BookingSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  date: { type: Date, required: true },
  status: { type: String, default: 'Pending', enum: ['Pending', 'Approved', 'Declined'] },
  totalAmount: { type: Number },
  dueAmount: { type: Number, default: 0 },
  paidAmount: { type: Number, default: 0 },
  BillSummary: [{
    recivedAmount: Number,
    payVia: String,
    Date: { type: Date, default: Date.now }
  }],
}, { timestamps: true });

const Booking = mongoose.model('Booking', BookingSchema);
module.exports = Booking;