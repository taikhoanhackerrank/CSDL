const { Sequelize, DataTypes, Model } = require('sequelize');
const dbConfig = require('../config/db.config');

const sequelize = new Sequelize(dbConfig.NAME, dbConfig.USERNAME, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: 'mysql',
  port: dbConfig.PORT
});

//define the OrderItem model
const OrderItem = sequelize.define('OrderItem', {
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    size: {
      type: DataTypes.STRING,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
}, {
    timestamps: false,
    createdAt: false,
    updatedAt: false
});

module.exports = OrderItem;