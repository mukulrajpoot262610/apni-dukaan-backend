const router = require('express').Router()
const authController = require('../controllers/auth-controller');
const userController = require('../controllers/user-controller');
const authMiddleware = require('../middleware/auth-middleware')

router.post('/api/send-otp', authController.sendOtp)
router.post('/api/verify-otp', authController.verifyOtp)
router.post('/api/verify-admin-otp', authController.verifyAdminOtp)
router.get('/api/refresh', authController.refresh)
router.post('/api/logout', authMiddleware, authController.logout)

router.post('/api/update-business-details', authMiddleware, userController.updateBusinessDetails)

// router.get('/api/products', productController.getAllProducts)
// router.get('/api/product/:id', productController.getProduct)

// router.post('/api/place-order', authMiddleware, orderController.placeOrder)
// router.post('/api/products', adminMiddleware, productController.addProduct)
// router.get('/api/stats', adminMiddleware, orderController.getStats)

///////////////////////////
// USERS ROUTES
// router.get('/api/users', adminMiddleware, userController.getAllUsers)

///////////////////////////
// ORDERS ROUTES
// router.get('/api/orders', adminMiddleware, orderController.getAllOrders)
// router.get('/api/order/:id', adminMiddleware, orderController.getOrderDetail)
// router.post('/api/order-status/:id', adminMiddleware, orderController.updateStatus)
// router.get('/api/order-status/:id', authMiddleware, orderController.getStatus)

///////////////////////////
// PAYMENT ROUTES
// router.get('/api/checkout', paymentController.initiatePayment)

module.exports = router;