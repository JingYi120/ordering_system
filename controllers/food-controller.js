const { Food, Category } = require('../models')

const foodController = {
  getFoods: async (req, res, next) => {
    try {
      const categoryId = Number(req.query.categoryId) || ''
      const [foods, categories] = await Promise.all([
        Food.findAndCountAll({
          include: Category,
          where: { ...categoryId ? { categoryId } : {} },
          nest: true,
          raw: true
        }),
        Category.findAll({ raw: true })
      ])

      res.render('foods', {
        foods: foods.rows,
        categories,
        categoryId
      })
    } catch (err) {
      next(err)
    }
  },
  getFood: async (req, res, next) => {
    try {
      const food = await Food.findByPk(req.params.id, {
        include: Category
      })
      if (!food) throw new Error("Food didn't exist!")

      res.render('food', {
        food: food.toJSON(),
      })
    } catch (err) {
      next(err)
    }
  }

}
module.exports = foodController