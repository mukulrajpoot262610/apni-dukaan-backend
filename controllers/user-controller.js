const userService = require("../services/user-service")
const slugify = require('slugify');
const mongoose = require('mongoose')
const productService = require("../services/product-service");
const userModal = require("../models/user-modal");
const orderService = require('../services/order-service')

class UserController {

    async updateBusinessDetails(req, res) {

        const { name, businessName, logo } = req.body;
        const userId = req.user._id

        try {
            const user = await userService.findUser({ _id: userId })

            user.businessName = businessName
            user.name = name
            user.logo = logo

            const checkUsername = await userService.findUser({ businessName })

            if (checkUsername) {
                return res.status(404).json({ msg: 'Business Name is not available.' })
            }

            user.storeLink = slugify(businessName, {
                lower: true,
            })

            await user.save()

            res.status(200).json({ user })
        } catch (err) {
            console.log(err)
            res.status(500).json({ msg: 'Internal Server Error' })
        }
    }

    async updateThemeDetails(req, res) {

        const { storeDesc, emailSupport, phoneSupport, deliveryCharges, deliveryTiming, image } = req.body;
        const userId = req.user._id

        try {
            const user = await userService.findUser({ _id: userId })

            user.description = storeDesc
            user.supportEmail = emailSupport
            user.supportPhone = phoneSupport
            user.deliveryCharges = deliveryCharges
            user.deliveryTiming = deliveryTiming
            user.banner = image

            await user.save()

            res.status(200).json({ user })
        } catch (err) {
            console.log(err)
            res.status(500).json({ msg: 'Internal Server Error' })
        }
    }

    async addCategory(req, res) {
        const { category } = req.body;
        const userId = req.user._id

        try {
            const user = await userService.findUser({ _id: userId })
            user.category = [...user.category, category]
            await user.save()
            res.status(200).json({ user })
        } catch (err) {
            console.log(err)
            res.status(500).json({ msg: 'Internal Server Error' })
        }
    }

    async getBusinessDetails(req, res) {
        const { slug } = req.body;

        try {
            const details = await userService.findUser({ storeLink: slug })
            res.status(200).json({ details })
        } catch (err) {
            console.log(err)
            res.status(500).json({ msg: 'Internal Server Error', err })
        }


    }

    async getBusinessProducts(req, res) {
        const { slug } = req.body;

        try {

            const details = await userService.findUser({ storeLink: slug })
            if (details) {
                const products = await productService.getAllProducts(details._id.toString())
                return res.status(200).json({ products })
            }
            return res.status(404).json({ msg: 'Product Not Found' })
        } catch (err) {
            console.log(err)
            return res.status(500).json({ msg: 'Internal Server Error', err })
        }


    }

    async updateAddress(req, res) {
        const { pincode, city, landmark, street, storeLink, email } = req.body;

        if (!pincode || !city || !landmark || !street || !storeLink || !email) {
            return res.status(400).json({ msg: 'All Fields are required' })
        }

        try {
            let user = await userService.findEndUser({ email, storeLink })

            if (!user) {
                return res.status(400).json({ msg: 'User not found' })
            }

            const address = { street, landmark, city, pincode }

            user.address.push(address)
            user.save()
            res.status(200).json({ user })

        } catch (err) {
            console.log(err)
            res.status(500).json({ msg: "Internal Server Error" })
        }
    }

    async getAllUsers(req, res) {

        const userId = req.user._id

        try {
            const user = await userService.findUser({ _id: userId })
            const storeLink = user.storeLink;
            const users = await userModal.find({ storeLink })
            return res.status(200).json({ users })
        } catch (err) {
            return res.status(500).json({ msg: 'Internal Server Error' })
        }
    }

    async getStats(req, res) {
        try {
            const userId = req.user._id
            const user = await userService.findUser({ _id: userId })

            if (!user) {
                return res.status(404).json({ msg: "User not found" })
            }

            const orders = await orderService.getAllOrder({ storeLink: user.storeLink })
            const users = await userService.getAllEndUser({ storeLink: user.storeLink })

            const sales = await orders.map((e) => e.totalPrice).reduce((a, b) => a + b, 0)

            res.status(200).json({
                totalSales: sales,
                totalUsers: users.length,
                totalOrders: orders.length,
            })

        } catch (err) {
            console.log(err)
            res.status(500).json({ msg: 'Internal Server Error' })
        }
    }


}

module.exports = new UserController()