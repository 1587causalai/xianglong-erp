const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Component = sequelize.define('Component', {
  component_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'component_id'
  },
  component_code: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    field: 'component_code'
  },
  component_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'component_name'
  },
  component_spec: {
    type: DataTypes.STRING(200),
    field: 'component_spec'
  },
  component_unit: {
    type: DataTypes.STRING(20),
    field: 'component_unit'
  },
  component_category: {
    type: DataTypes.STRING(50),
    field: 'component_category'
  },
  component_price: {
    type: DataTypes.DECIMAL(10, 2),
    field: 'component_price'
  },
  min_stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'min_stock'
  },
  max_stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'max_stock'
  },
  lead_time: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'lead_time'
  },
  default_supplier_id: {
    type: DataTypes.INTEGER,
    field: 'default_supplier_id'
  },
  component_status: {
    type: DataTypes.TINYINT,
    defaultValue: 1,
    field: 'component_status'
  },
  component_desc: {
    type: DataTypes.TEXT,
    field: 'component_desc'
  }
}, {
  tableName: 'components',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Component;
