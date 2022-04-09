import Settings from '../models/SettingsModal'


// @route  GET api/products
// @desc   GET Products
// @access PRIVATE
export const getProducts = async (req, res) => {
    const { email } = req.currentUser;

    try {
        const settings = await Settings.findOne({ email })

        if (!settings) {
            return res.status(404).json({ success: false, err: 'Please add your business details' })
        }

        const products = settings.products

        return res.status(200).json({ success: true, products })

    } catch (err) {

    }
}

// @route  POST api/category
// @desc   GET Category
// @access PRIVATE
export const addProductCategory = async (req, res) => {
    const { email } = req.currentUser;

    try {
        const settings = await Settings.findOne({ email }, { $push: { category: [req.body] } })

        if (!settings) {
            return res.status(404).json({ success: false, err: 'Please add your business details' })
        }

        return res.status(200).json({ success: true, settings, })

    } catch (err) {

    }
}