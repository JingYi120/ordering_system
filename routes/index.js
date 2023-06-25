const express = require('express')
const router = express.Router()
const foodController = require('../controllers/food-controller')
const admin = require('./modules/admin')

router.use('/admin', admin)
router.get('/foods', foodController.getFoods)
router.use('/', (req, res) => res.redirect('/foods'))

module.exports = router