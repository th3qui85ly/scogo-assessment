const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true },
    price: { type: mongoose.Schema.Types.ObjectId, required: true },
    orderDate: { type: Date, required: true },
    isFulfilled: { type: Boolean, required: true }
})

const Order = module.exports = mongoose.model('Order', OrderSchema);