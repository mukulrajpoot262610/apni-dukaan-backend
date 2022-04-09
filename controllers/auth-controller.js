const hashService = require("../services/hash-service");
const otpService = require("../services/otp-service");
const tokenService = require("../services/token-service");
const userService = require("../services/user-service");

class AuthController {
    async sendOtp(req, res) {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ msg: 'Email Field is required' })
        }

        const otp = await otpService.generateOtp()

        //hash
        const ttl = 1000 * 60 * 2  // 2 Minute expiry time
        const expires = Date.now() + ttl;
        const data = `${email}.${otp}.${expires}`
        const hash = hashService.hashOtp(data)

        //sendOtp
        try {
            // await otpService.sendBySms(phone, otp);
            res.status(200).json({
                hash: `${hash}.${expires}`,
                email,
                otp
            })
        } catch (err) {
            console.log(err)
            res.status(500).json({ msg: 'otp sending failed' })
        }
    }

    async verifyOtp(req, res) {
        const { otp, hash, email } = req.body;

        if (!otp || !hash || !email) {
            return res.status(400).json({ msg: 'All Fields are required' })
        }

        const [hashedOtp, expires] = hash.split('.');

        if (Date.now() > +expires) {
            return res.status(400).json({ msg: 'OTP Expired' })
        }

        const data = `${email}.${otp}.${expires}`
        const isValid = await otpService.verifyOtp(hashedOtp, data)

        if (!isValid) {
            return res.status(400).json({ msg: 'Invalid OTP' })
        }

        let user;

        try {
            user = await userService.findUser({ email })
            if (!user) {
                user = await userService.createUser({ email })
            }
        } catch (err) {
            console.log(err)
            return res.status(500).json({ msg: 'Internal Server Error' })
        }

        // token
        const { accessToken, refreshToken } = tokenService.generateToken({ _id: user._id, activated: false })

        await tokenService.storeRefreshToken(refreshToken, user._id)

        res.cookie('dukaanAccessCookie', accessToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
            httpOnly: true
        })

        res.cookie('dukaanRefreshCookie', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
            httpOnly: true
        })

        res.json({ auth: true, user })

    }

    async verifyAdminOtp(req, res) {
        const { otp, hash, email } = req.body;

        if (!otp || !hash || !email) {
            return res.status(400).json({ msg: 'All Fields are required' })
        }

        const [hashedOtp, expires] = hash.split('.');

        if (Date.now() > +expires) {
            return res.status(400).json({ msg: 'OTP Expired' })
        }

        const data = `${email}.${otp}.${expires}`
        const isValid = await otpService.verifyOtp(hashedOtp, data)

        if (!isValid) {
            return res.status(400).json({ msg: 'Invalid OTP' })
        }

        let user;

        try {
            user = await userService.findUser({ email })
            if (!user) {
                user = await userService.createUser({ email })
            }
        } catch (err) {
            console.log(err)
            return res.status(500).json({ msg: 'Internal Server Error' })
        }

        // token
        const { accessToken, refreshToken } = tokenService.generateToken({ _id: user._id, activated: false })

        await tokenService.storeRefreshToken(refreshToken, user._id)

        res.cookie('accessCookie', accessToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
            httpOnly: true
        })

        res.cookie('refreshCookie', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
            httpOnly: true
        })

        res.json({ auth: true, user })

    }

    async refresh(req, res) {
        // getrefresh token from header
        const { dukaanRefreshCookie: refreshTokenFromCookie } = req.cookies

        // check if token is valid
        let userData;
        try {
            userData = await tokenService.verifyRefreshToken(refreshTokenFromCookie)
        } catch (err) {
            return res.status(401).json({ msg: 'Invalid Token' })
        }

        // check the token is in the db
        try {
            const token = await tokenService.findRefreshToken(userData._id, refreshTokenFromCookie)
            if (!token) {
                return res.status(401).json({ msg: 'Invalid Token' })
            }
        } catch (err) {
            return res.status(500).json({ msg: 'Internal Server Error' })
        }

        // check valid user
        const user = await userService.findUser({ _id: userData._id })
        if (!user) {
            return res.status(404).json({ msg: 'Invalid User' })
        }

        // generate new token
        const { accessToken, refreshToken } = tokenService.generateToken({ _id: userData._id })

        // update refresh token
        try {
            tokenService.updateRefreshToken(userData._id, refreshToken)
        } catch (err) {
            return res.status(500).json({ msg: 'Internal Server Error' })
        }

        // put it in cookie
        res.cookie('dukaanAccessCookie', accessToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
            httpOnly: true
        })

        res.cookie('dukaanRefreshCookie', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
            httpOnly: true
        })

        // response
        res.json({ auth: true, user })
    }

    async logout(req, res) {
        const { dukaanRefreshCookie } = req.cookies
        await tokenService.removeToken(dukaanRefreshCookie)

        res.clearCookie('dukaanRefreshCookie')
        res.clearCookie('dukaanAccessCookie')
        res.json({ user: null, auth: false })
    }
}

module.exports = new AuthController();