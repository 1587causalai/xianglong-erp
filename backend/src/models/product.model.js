const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  product_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'product_id'
  },
  product_code: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    field: 'product_code'
  },
  product_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'product_name'
  },
  product_spec: {
    type: DataTypes.STRING(200),
    field: 'product_spec'
  },
  product_unit: {
    type: DataTypes.STRING(20),
    field: 'product_unit'
  },
  product_category: {
    type: DataTypes.STRING(50),
    field: 'product_category'
  },
  product_price: {
    type: DataTypes.DECIMAL(10, 2),
    field: 'product_price'
  },
  product_cost: {
    type: DataTypes.DECIMAL(10, 2),
    field: 'product_cost'
  },
  product_status: {
    type: DataTypes.TINYINT,
    defaultValue: 1,
    field: 'product_status'
  },
  product_desc: {
    type: DataTypes.TEXT,
    field: 'product_desc'
  }
}, {
  tableName: 'products',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Product;
