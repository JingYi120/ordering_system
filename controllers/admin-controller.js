const { Food, Category, Order, OrderDetail, User } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')
const dayjs = require('dayjs')

const adminController = {
  getFoods: async(req, res, next) => {
    try {
      const categoryId = Number(req.query.categoryId) || ''
      const [foods, categories] = await Promise.all([Food.findAll({
        raw: true,
        nest: true,
        include: Category,
        where: {
          ...categoryId ? { categoryId } : {}
        },
        order: [
          ['createdAt', 'desc']
        ]
      }),
      Category.findAll({ raw: true })
      ])
      res.render('admin/foods', { foods, categories })
    } catch (err) {
      next(err)
    }
  },
  createFood: async (req, res, next) => {
    try {
      const categories = await Category.findAll({ raw: true })
      res.render('admin/create-food', { categories })
    } catch (err) {
      next(err)
    }
  },
  postFood: async(req, res, next) => {
    try{
      const { name, description, price, categoryId, inventory } = req.body
      const { file } = req
      const [foods, filePath] = await Promise.all([
        Food.findAll({ raw: true }),
        imgurFileHandler(file)
      ])

      if (!name || !description || !price || !inventory) throw new Error('All fields are required!')

      const isFoodExists = foods.some(cat => cat.name === name);
      if (isFoodExists) {
        throw new Error(`This name has already been created.`);
      }
      
      await Food.create({
        name,
        description,
        price,
        categoryId,
        inventory,
        image: filePath || null
      })

      req.flash('success_messages', 'Food was successfully created')
      res.redirect('/admin/foods')

    }catch(err){
      next(err)
    }
  },
  getFood: async (req, res, next) => {
    try {
      const food = await Food.findByPk(req.params.id, {
        include: Category
      })
      if (!food) throw new Error("Food didn't exist!");
      res.render('admin/food', { food: food.toJSON() });
    } catch (err) {
      next(err)
    }
  },
  editFood: async (req, res, next) => {
    try {
      const [food, categories] = await Promise.all([
        Food.findByPk(req.params.id),
        Category.findAll({ raw: true }),
      ])

      if (!food) throw new Error("Food didn't exist!")
      
      res.render('admin/edit-food', { food: food.toJSON(), categories })
    } catch (err) {
      next(err)
    }
  },
  putFood: async (req, res, next) => {
    try {
      const { name, description, price, categoryId, inventory } = req.body

      if (!name || !description || !price || !inventory) throw new Error('All fields are required!');
      const { file } = req

      const [food, foods, filePath] = await Promise.all([
        Food.findByPk(req.params.id),
        Food.findAll({ raw: true }),
        imgurFileHandler(file)
      ])

      if (!food) throw new Error("Food doesn't exist!");
      const isFoodExists = foods.some(cat => cat.name === name);
      if (isFoodExists) {
        throw new Error(`This name has already been created.`);
      }

      await food.update({
        name,
        description,
        price,
        categoryId,
        inventory,
        image: filePath || food.image
      });

      req.flash('success_messages', 'Food was successfully updated');
      res.redirect('/admin/foods');
    } catch (err) {
      next(err);
    }
  },
  deleteFood: async (req, res, next) => {
    try {
      const food = await Food.findByPk(req.params.id)
      if (!food) throw new Error("Food didn't exist!")
      await food.destroy()
      res.redirect('/admin/foods')
    } catch (err) {
      next(err)
    }
  },
  getOrders: async (req, res, next) => {
    try {
      const orders = await Order.findAll({
        raw: true,
        nest: true,
        include: [User],
        where: { isOrder: true },
        order: [
          ['isDone', 'asc'],
          ['createdAt', 'asc']
        ]
      })

      const result = orders.map(order => ({
        ...order,
        createdAt: dayjs(order.createdAt).format('YYYY-MM-DD') + '__' + dayjs(order.createdAt).format('HH:mm:ss')
      }))

      res.render('admin/orders', { orders: result })
    } catch (err) {
      next(err)
    }
  },
}
module.exports = adminController