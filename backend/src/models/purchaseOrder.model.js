const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PurchaseOrder = sequelize.define('PurchaseOrder', {
  purchase_order_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'purchase_order_id'
  },
  order_no: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    field: 'order_no'
  },
  supplier_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'supplier_id'
  },
  order_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'order_date'
  },
  expected_date: {
    type: DataTypes.DATEONLY,
    field: 'expected_date'
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
  tableName: 'purchase_orders',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

const PurchaseOrderItem = sequelize.define('PurchaseOrderItem', {
  order_item_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'order_item_id'
  },
  purchase_order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'purchase_order_id'
  },
  component_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'component_id'
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
  received_quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'received_quantity'
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
  tableName: 'purchase_order_items',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = {
  PurchaseOrder,
  PurchaseOrderItem
};
