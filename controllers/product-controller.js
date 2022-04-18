const productService = require("../services/product-service");

class ProductController {

    async addProduct(req, res) {
        const { name, category, image, details, discountedPrice, mrp, unit, unitUnit } = req.body;

        if (!name || !category || !image || !details || !discountedPrice || !mrp || !unit || !unitUnit) {
            return res.status(404).json({ msg: 'All Fields Required' })
        }

        const userId = req.user._id

        try {

            const product = await productService.addProduct({ name, category, image, details, discountedPrice, mrp, unit, unitUnit, userId })

            res.status(200).json({ product })

        } catch (err) {
            res.status(500).json({ msg: 'Internal Server Error' })
        }
    }

    async getAllProducts(req, res) {

        const userId = req.user._id

        try {
            const products = await productService.getAllProducts(userId)
            return res.status(200).json({ products })
        } catch (err) {
            return res.status(500).json({ msg: 'Internal Server Error' })
        }
    }

}

module.exports = new ProductController()