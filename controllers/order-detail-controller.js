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

      let orderId = ''
      if (!order) {
        const newOrder = await Order.create({ userId });
        orderId = newOrder.id;
      } else {
        orderId = order.id;
      }

      if (orderDetail && orderDetail.Order.userId === userId) {
        orderDetail.quantity += Number(quantity);
        await orderDetail.save();
      } else {
        await OrderDetail.create({
          foodId,
          quantity,
          orderId
        });
      }

      req.flash('success_messages', 'Add to cart!');
      res.redirect(`/foods`);
    } catch (err) {
      next(err);
    }
  },
  deleteOrderDetail: async (req, res, next) => {
    try {
      const orderDetail = await OrderDetail.findByPk(req.params.id)
      if (!orderDetail) throw new Error("OrderDetail didn't exist!")

      await orderDetail.destroy()
      res.sendStatus(200)
    } catch (err) {
      next(err)
    }
  }

};

module.exports = orderDetailController;
