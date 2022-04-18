const Product = require('../models/product-modal')

class ProductService {

    async addProduct(data) {
        const product = await Product.create(data)
        return product
    }

    async getAllProducts(userId) {
        try {
            const products = await Product.find({ userId })
            return products
        } catch (err) {
            return err
        }
    }

}

module.exports = new ProductService()