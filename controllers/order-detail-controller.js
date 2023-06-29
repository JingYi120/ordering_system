const { OrderDetail, Food, User, Order } = require('../models');
const { getUser } = require('../helpers/auth-helpers')

const orderDetailController = {
  postOrderDetail: async (req, res, next) => {
    try {
      const { foodId, quantity } = req.body;
      const userId = getUser(req).id

      const [user, food, orderDetail, order] = await Promise.all([
        User.findByPk(userId),
        Food.findByPk(foodId),
        OrderDetail.findOne({
          where: { isOrder: false, foodId },
          include: [Food, Order],
        }), Order.findOne({
          where: { userId, isOrder: false },
        })])

      if (!user) throw new Error("User didn't exist!")
      if (!food) throw new Error("Food didn't exist!")
      if (quantity > food.inventory) throw new Error(`Last ${food.inventory} servings!`)

      let orderId = ''
      if (!order) {
        const newOrder = await Order.create({ userId });
        orderId = newOrder.id;
      } else {
        orderId = order.id;
      }

      if (orderDetail && order.userId === userId) {
        orderDetail.quantity += Number(quantity);
        await orderDetail.save();
      } else {
        await OrderDetail.create({
          foodId,
          quantity,
          orderId
        });
      }

      food.inventory -= Number(quantity)
      await food.save()

      req.flash('success_messages', 'Add to cart!');
      res.redirect('/foods');
    } catch (err) {
      next(err);
    }
  },
  deleteOrderDetail: async (req, res, next) => {
    try {
      const orderDetail = await OrderDetail.findByPk(req.params.id,{
        include: Food
      })
      if (!orderDetail) throw new Error("OrderDetail didn't exist!")

      const orderDetailDestroy = await orderDetail.destroy()
      orderDetailDestroy.Food.inventory += Number(orderDetailDestroy.quantity)
      await orderDetailDestroy.Food.save()
      res.sendStatus(200)
    } catch (err) {
      next(err)
    }
  }

};

module.exports = orderDetailController;
