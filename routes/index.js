const router = require('express').Router()
const authController = require('../controllers/auth-controller');
const userController = require('../controllers/user-controller');
const authMiddleware = require('../middleware/auth-middleware')
const productController = require('../controllers/product-controller')

// AUTH
router.post('/api/send-otp', authController.sendOtp)
router.post('/api/verify-otp', authController.verifyOtp)
router.post('/api/verify-admin-otp', authController.verifyAdminOtp)
router.get('/api/refresh', authController.refresh)
router.post('/api/logout', authMiddleware, authController.logout)

// UPDATE
router.post('/api/update-business-details', authMiddleware, userController.updateBusinessDetails)
router.post('/api/add-category', authMiddleware, userController.addCategory)

// PRODUCTS
router.post('/api/add-product', authMiddleware, productController.addProduct)
router.get('/api/get-all-product', authMiddleware, productController.getAllProducts)

// TEMPLTE
router.post('/api/get-store', userController.getBusinessDetails)
router.post('/api/get-products', userController.getBusinessProducts)

module.exports = router;