const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    isAdmin: { type: Boolean, default: false },
    email: { type: String, required: true },
    name: { type: String },
    gender: { type: String },
    address: [
        {
            street: { type: String },
            landmark: { type: String },
            country: { type: String },
            state: { type: String },
            city: { type: String },
            pincode: { type: String },
        }
    ],
    orders: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId, ref: 'Order'
            }
        ]
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("User", userSchema, 'users')