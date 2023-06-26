const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')
const categoryController = require('../../controllers/category-controller')

router.get('/categories/:id', categoryController.getCategories)
router.put('/categories/:id', categoryController.putCategory)
router.delete('/categories/:id', categoryController.deleteCategory)
router.get('/categories', categoryController.getCategories)
router.post('/categories', categoryController.postCategory)

router.get('/foods/create', adminController.createFood)
router.get('/foods/:id/edit', adminController.editFood)
router.get('/foods/:id', adminController.getFood)
router.put('/foods/:id', adminController.putFood)
router.get('/foods', adminController.getFoods)
router.post('/foods', adminController.postFood)
router.use('/', (req, res) => res.redirect('/admin/foods'))

module.exports = router