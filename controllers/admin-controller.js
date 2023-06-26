const { Food, Category } = require('../models')

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
  postFood: (req, res, next) => {

  const { name, description, price, categoryId, inventory } = req.body
    if (!name || !description || !price || !inventory) throw new Error('All fields are required!');
  Food.create({
    name,
    description,
    price,
    categoryId,
    inventory
  })
    .then(() => {
      req.flash('success_messages', 'Food was successfully created')
      res.redirect('/admin/foods')
    })
    .catch(err => next(err))
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

      const food = await Food.findByPk(req.params.id);
      if (!food) throw new Error("Food doesn't exist!");

      await food.update({
        name,
        description,
        price,
        categoryId,
        inventory
      });

      req.flash('success_messages', 'Food was successfully updated');
      res.redirect('/admin/foods');
    } catch (err) {
      next(err);
    }
  },
}
module.exports = adminController