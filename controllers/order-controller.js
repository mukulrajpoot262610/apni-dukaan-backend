const userService = require("../services/user-service")
const slugify = require('slugify');
const mongoose = require('mongoose')
const productService = require("../services/product-service");
const orderService = require('../services/order-service');
const orderModal = require("../models/order-modal");

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
                userId: user._id,
                storeLink,
            })

            res.status(200).json({ order, user })

        } catch (err) {
            console.log(err)
            res.status(500).json({ msg: "Internal Server Error" })
        }
    }

    async getAllOrders(req, res) {

        const userId = req.user._id

        try {
            const user = await userService.findUser({ _id: userId })
            const storeLink = user.storeLink;
            const orders = await orderModal.find({ storeLink })
            return res.status(200).json({ orders })
        } catch (err) {
            return res.status(500).json({ msg: 'Internal Server Error' })
        }
    }

    async getOrderDetail(req, res) {

        const { id } = req.body

        try {
            const userId = req.user._id
            const user = await userService.findUser({ _id: userId })

            if (!user) {
                return res.status(404).json({ msg: "User not found" })
            }

            const order = await orderService.getOrder(id)
            res.status(200).json({ order })

        } catch (err) {
            console.log(err)
            res.status(500).json({ msg: 'Internal Server Error' })
        }

    }

    async getUserOrders(req, res) {

        const { userId, storeLink } = req.body;

        try {
            const orders = await orderModal.find({ storeLink, userId })
            return res.status(200).json({ orders })
        } catch (err) {
            return res.status(500).json({ msg: 'Internal Server Error' })
        }
    }

}

module.exports = new OrderController()