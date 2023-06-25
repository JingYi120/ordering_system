const express = require('express')
const router = express.Router()
const foodController = require('../controllers/food-controller')

router.get('/foods', foodController.getFoods)
router.use('/', (req, res) => res.redirect('/foods'))

module.exports = router