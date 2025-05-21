const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SalesOrder = sequelize.define('SalesOrder', {
  sales_order_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'sales_order_id'
  },
  order_no: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    field: 'order_no'
  },
  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'customer_id'
  },
  order_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'order_date'
  },
  delivery_date: {
    type: DataTypes.DATEONLY,
    field: 'delivery_date'
  },
  order_status: {
    type: DataTypes.TINYINT,
    defaultValue: 0,
    field: 'order_status'
  },
  total_amount: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0,
    field: 'total_amount'
  },
  order_remark: {
    type: DataTypes.TEXT,
    field: 'order_remark'
  },
  created_by: {
    type: DataTypes.STRING(50),
    field: 'created_by'
  }
}, {
  tableName: 'sales_orders',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

const SalesOrderItem = sequelize.define('SalesOrderItem', {
  order_item_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'order_item_id'
  },
  sales_order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'sales_order_id'
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'product_id'
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'quantity'
  },
  unit_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'unit_price'
  },
  line_amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    field: 'line_amount'
  },
  delivered_quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'delivered_quantity'
  },
  item_status: {
    type: DataTypes.TINYINT,
    defaultValue: 0,
    field: 'item_status'
  },
  item_remark: {
    type: DataTypes.TEXT,
    field: 'item_remark'
  }
}, {
  tableName: 'sales_order_items',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = {
  SalesOrder,
  SalesOrderItem
};
