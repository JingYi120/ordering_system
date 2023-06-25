const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')
const categoryController = require('../../controllers/category-controller')

router.get('/categories/:id', categoryController.getCategories)
router.get('/categories', categoryController.getCategories)
router.post('/categories', categoryController.postCategory)

router.get('/foods', adminController.getFoods)
router.use('/', (req, res) => res.redirect('/admin/foods'))

module.exports = router