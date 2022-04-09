import Settings from '../../backend/models/SettingsModal'


// @route  GET api/category
// @desc   GET Category
// @access PRIVATE
export const getProductCategories = async (req, res) => {
    const { email } = req.currentUser;

    try {
        const settings = await Settings.findOne({ email })

        if (!settings) {
            return res.status(404).json({ success: false, err: 'Please add your business details' })
        }

        const category = settings.category

        return res.status(200).json({ success: true, category })

    } catch (err) {

    }
}

// @route  POST api/category
// @desc   GET Category
// @access PRIVATE
export const addProductCategory = async (req, res) => {
    const { email } = req.currentUser;

    console.log(email)
    console.log(req.body)

    try {
        // const settings = await Settings.findOne({ email }, { $push: { category: [req.body] } })

        // console.log(settings)

        // if (!settings) {
        //     return res.status(404).json({ success: false, err: 'Please add your business details' })
        // }

        return res.status(200).json({ success: true, email, body: req.body })

    } catch (err) {

    }
}

// @route  POST api/category
// @desc   GET Category
// @access PRIVATE
export const deleteProductCategory = async (req, res) => {
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