const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    orderItems: [
        {
            product: {
                _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
                name: { type: String },
                discountedPrice: { type: String },
            },
            qty: { type: Number, default: 1 },
        }
    ],
    shippingAddress: {
        street: { type: String },
        landmark: { type: String },
        city: { type: String },
        pinCode: { type: String },
    },
    paymentMethod: { type: String },
    shippingPrice: { type: Number, default: 0.0 },
    totalPrice: { type: Number, default: 0.0 },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
    status: { type: String, default: 'Shipped' },
}, {
    timestamps: true
})

module.exports = mongoose.model("Order", orderSchema, 'orders')