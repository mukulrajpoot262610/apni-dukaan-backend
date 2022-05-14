const userService = require("../services/user-service")
const slugify = require('slugify');
const mongoose = require('mongoose')
const productService = require("../services/product-service");
const orderService = require('../services/order-service')

class OrderController {

    async placeOrder(req, res) {
        const { orderItems, shippingAddress, paymentMethod, totalPrice, storeLink, email } = req.body

        if (!orderItems || !shippingAddress || !paymentMethod || !totalPrice) {
            return res.status(400).json({ msg: 'All Field are required' })
        }

        try {
            const user = await userService.findEndUser({ email, storeLink })

            if (!user) {
                return res.status(404).json({ msg: "User not found" })
            }

            const order = await orderService.createOrder({
                orderItems,
                shippingAddress,
                paymentMethod,
                totalPrice,
                userId: user._id
            })

            user.orders = [order._id, ...user.orders]
            await user.save()

            res.status(200).json({ order, user })

        } catch (err) {
            console.log(err)
            res.status(500).json({ msg: "Internal Server Error" })
        }
    }


}

module.exports = new OrderController()