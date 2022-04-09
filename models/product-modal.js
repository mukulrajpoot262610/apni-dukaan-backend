const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String },
    category: { type: String },
    mrp: { type: String },
    discountedPrice: { type: String },
    unit: { type: String },
    unitUnit: { type: String },
    details: { type: String },
    image: [{ type: String }],
}, {
    timestamps: true
})

module.exports = mongoose.model("Product", productSchema, 'products')