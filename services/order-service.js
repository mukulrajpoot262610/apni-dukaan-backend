const orderModal = require("../models/order-modal")

class OrderService {

    async createOrder(data) {
        try {
            const order = await orderModal.create(data)
            return order
        } catch (err) {
            console.log(err)
        }
    }

    async getAllOrder() {
        try {
            const orders = await orderModal.find()
            return orders
        } catch (err) {
            console.log(err)
        }
    }

    async getOrder(id) {
        try {
            const order = await orderModal.findById(id)
            return order
        } catch (err) {
            console.log(err)
        }
    }
}

module.exports = new OrderService()