import Settings from '../models/SettingsModal'

// @route  POST api/settings
// @desc   ADD Settings
// @access PRIVATE
export const AddSetings = async (req, res) => {
    const { logo, name } = req.body;
    const { sub, email } = req.currentUser;

    const profileFields = {
        logo,
        name,
        email
    }

    try {
        let profile = await Settings.findById(sub)
        if (profile) {
            // UPDATE
            console.log('Here')
            profile = await Settings.findByIdAndUpdate(sub, profileFields)
            return res.json({ profile })
        }

        // CREATE
        profile = new Settings(profileFields);

        await profile.save()
        res.json({ profile })

    } catch (err) {
        console.log(err.message)
        res.status(400).send('ROUTES: Server Error')
    }
}


// @route  GET api/settings
// @desc   ADD Settings
// @access PRIVATE
export const getSettings = async (req, res) => {
    const { email } = req.currentUser;

    try {
        const settings = await Settings.findOne({ email })

        if (!settings) {
            return res.status(404).json({ success: false, err: 'Please add your business details' })
        }

        return res.status(200).json({ success: true, settings, })

    } catch (err) {

    }
}