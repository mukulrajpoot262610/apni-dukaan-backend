const router = require('express').Router()
const Settings = require('../models/SettingsModal')

// CHECK SALARY FOR GUEST USER
router.get('/', async (req, res) => {

    const { email } = req.currentUser;

    try {
        const settings = await Settings.findOne({ email })

        if (!settings) {
            return res.status(404).json({ success: false, err: 'Please add your business details' })
        }

        return res.status(200).json({ success: true, settings, })

    } catch (err) {

    }
})

module.exports = router