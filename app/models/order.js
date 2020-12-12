const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    items: {
        type: Object,
        required: true,
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        default: 'customer'
    },
    paymentType: {
        type: String,
        default: "CASH ON DELIVERY"
    },
    phone: {
        type: String,
        default: "Ordered_Placed"
    },
}, { timestamps: true })


const Order = new mongoose.model('Order', orderSchema);
module.exports = Order;