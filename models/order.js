'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsTo(models.User, { foreignKey: 'userId' })
      Order.hasMany(models.OrderDetail, { foreignKey: 'orderId' })
    }
  }
  Order.init({
    userId: DataTypes.INTEGER,
    note: DataTypes.TEXT,
    isOrder: DataTypes.BOOLEAN,
    isDone: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Order',
    tableName: 'Orders',
    underscored: true,
  });
  return Order;
};