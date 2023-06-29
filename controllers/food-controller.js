const { Food, Category, User, Order, OrderDetail } = require('../models')
const { getUser } = require('../helpers/auth-helpers')

const foodController = {
  getFoods: async (req, res, next) => {
    try {
      const userId = getUser(req).id
      const categoryId = Number(req.query.categoryId) || ''
      const [foods, categories, order, user] = await Promise.all([
        Food.findAndCountAll({
          include: Category,
          where: { ...categoryId ? { categoryId } : {} },
          nest: true,
          raw: true
        }),
        Category.findAll({ raw: true }),
        Order.findOne({
          where: { userId, isOrder: false },
          include: { model: OrderDetail, include: Food }
        }),
        User.findByPk(userId)
      ])

      let total = 0;
      if (order) {
        order.OrderDetails.forEach((orderDetail) => {
          const price = Number(orderDetail.Food.price);
          const quantity = Number(orderDetail.quantity);
          total += price * quantity;
        });
      }

      // const inventoryZero = foods.rows.inventory === 0

      return res.render('foods', {
        foods: foods.rows,
        categories,
        categoryId,
        order: order ? order.toJSON() : null,
        user: user ? user.toJSON() : null,
        userId,
        total,
        // inventoryZero
      });

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