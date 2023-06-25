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
  }
}
module.exports = adminController