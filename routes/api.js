'use strict'
const { Router } = require('express')
const { AuthController } = require('../controllers/AuthController')
const { UserController } = require('../controllers/UserController')
const { AdminMiddleware } = require('./../middlewares/AdminMiddleware')
const { UserMiddleware } = require('./../middlewares/UserMiddleware')

const adminRoutes = require('./admin')
const userRoutes = require('./user')

let router = new Router()

//**ROUTERS START */

/* Verify OTP */
router.post('/verify-otp', AuthController.verifyOTP);

/** Admin Panel Routes */
router.post('/login-admin', AuthController.loginAdmin)
router.use('/admin', AdminMiddleware.isAuthorized, adminRoutes)

/** User Auth routes */
router.post('/login', AuthController.login)
router.use('/user', UserMiddleware.isAuthorized, userRoutes)

/**Authentication */
router.get('/check-auth', AuthController.checkAuth)

/* GET users listing. */
router.get('/users', UserController.getAllUsers);
router.post('/user', UserController.addUser);
router.get('/user/:id', UserController.getUser);
router.delete('/user/:id', UserController.deleteUser);
router.put('/user/:id', UserController.updateUser);

//***ROUTERS END */

module.exports = router