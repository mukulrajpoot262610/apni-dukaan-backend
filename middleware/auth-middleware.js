const tokenService = require('../services/token-service')

module.exports = async function (req, res, next) {

    try {
        const { dukaanAccessCookie } = req.cookies
        if (!dukaanAccessCookie) {
            throw new Error()
        }

        const userData = await tokenService.verifyAccessToken(dukaanAccessCookie)

        if (!userData) {
            throw new Error()
        }

        req.user = userData
        next()
    } catch (err) {
        res.status(401).json({ msg: 'Invalid Token' })
    }

}