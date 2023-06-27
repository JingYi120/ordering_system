const express = require('express')
const router = express.Router()
const foodController = require('../controllers/food-controller')
const userController = require('../controllers/user-controller')
const orderDetailController = require('../controllers/order-detail-controller')
const passport = require('../config/passport')
const admin = require('./modules/admin')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')

router.use('/admin', authenticatedAdmin, admin)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/logout', userController.logout)

router.post('/orderDetails', authenticated, orderDetailController.postOrderDetail)
router.delete('/orderDetails/:id', authenticated, orderDetailController.deleteOrderDetail)

router.get('/foods/:id', authenticated, foodController.getFood)
router.get('/foods', authenticated, foodController.getFoods)
router.use('/', (req, res) => res.redirect('/foods'))
router.use('/', generalErrorHandler)

module.exports = router