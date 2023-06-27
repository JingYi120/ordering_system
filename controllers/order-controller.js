const { OrderDetail, Food, User, Order } = require('../models');
const { getUser } = require('../helpers/auth-helpers')

const orderController = {
  postOrder: async (req, res, next) => {
    try {
      const userId = getUser(req).id;
      const { note } = req.body;
      const order = await Order.findOne({
        where: { userId, isOrder: false }
      });

      await OrderDetail.update(
        { isOrder: true },
        { where: { orderId: order.id } }
      );
      await Order.update(
        { note, isOrder: true },
        { where: { id: order.id } }
      );

      req.flash('success_messages', 'The order has been successfully submitted.');
      res.redirect(`/foods`);
    } catch (err) {
      next(err);
    }
  },

};

module.exports = orderController;
