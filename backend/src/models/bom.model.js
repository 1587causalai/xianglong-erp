const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BomHeader = sequelize.define('BomHeader', {
  bom_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'bom_id'
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'product_id'
  },
  bom_version: {
    type: DataTypes.STRING(20),
    allowNull: false,
    field: 'bom_version'
  },
  bom_status: {
    type: DataTypes.TINYINT,
    defaultValue: 1,
    field: 'bom_status'
  },
  bom_remark: {
    type: DataTypes.TEXT,
    field: 'bom_remark'
  }
}, {
  tableName: 'bom_headers',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

const BomDetail = sequelize.define('BomDetail', {
  bom_detail_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'bom_detail_id'
  },
  bom_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'bom_id'
  },
  component_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'component_id'
  },
  quantity: {
    type: DataTypes.DECIMAL(10, 3),
    allowNull: false,
    field: 'quantity'
  },
  bom_detail_remark: {
    type: DataTypes.TEXT,
    field: 'bom_detail_remark'
  }
}, {
  tableName: 'bom_details',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = {
  BomHeader,
  BomDetail
};
