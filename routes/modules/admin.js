const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')

router.get('/foods', adminController.getFoods)
router.use('/', (req, res) => res.redirect('/admin/foods'))

module.exports = router