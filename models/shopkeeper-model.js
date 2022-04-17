const mongoose = require('mongoose')

const shopkeeperSchema = new mongoose.Schema({
    name: { type: String },
    businessName: { type: String },
    logo: { type: String },
    email: { type: String, unique: true },
    storeLink: { type: String },
    isSeller: { type: Boolean, default: true },
    template: { type: Number, default: 1 },
    category: [
        {
            type: String
        }
    ]
},
    { timestamps: true }
)

module.exports = mongoose.model("Shopkeeper", shopkeeperSchema);