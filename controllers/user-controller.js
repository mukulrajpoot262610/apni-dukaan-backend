const userService = require("../services/user-service")
const slugify = require('slugify')

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

}

module.exports = new UserController()