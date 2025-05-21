const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const InventoryTransaction = sequelize.define('InventoryTransaction', {
  transaction_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'transaction_id'
  },
  transaction_no: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    field: 'transaction_no'
  },
  transaction_type: {
    type: DataTypes.TINYINT,
    allowNull: false,
    field: 'transaction_type'
  },
  transaction_date: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'transaction_date'
  },
  reference_no: {
    type: DataTypes.STRING(50),
    field: 'reference_no'
  },
  reference_type: {
    type: DataTypes.STRING(20),
    field: 'reference_type'
  },
  warehouse_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'warehouse_id'
  },
  transaction_status: {
    type: DataTypes.TINYINT,
    defaultValue: 1,
    field: 'transaction_status'
  },
  transaction_remark: {
    type: DataTypes.TEXT,
    field: 'transaction_remark'
  },
  created_by: {
    type: DataTypes.STRING(50),
    field: 'created_by'
  }
}, {
  tableName: 'inventory_transactions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

const InventoryTransactionDetail = sequelize.define('InventoryTransactionDetail', {
  detail_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'detail_id'
  },
  transaction_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'transaction_id'
  },
  item_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'item_id'
  },
  item_type: {
    type: DataTypes.TINYINT,
    allowNull: false,
    field: 'item_type'
  },
  location_id: {
    type: DataTypes.INTEGER,
    field: 'location_id'
  },
  quantity: {
    type: DataTypes.DECIMAL(10, 3),
    allowNull: false,
    field: 'quantity'
  },
  unit_cost: {
    type: DataTypes.DECIMAL(10, 2),
    field: 'unit_cost'
  },
  batch_no: {
    type: DataTypes.STRING(50),
    field: 'batch_no'
  },
  detail_remark: {
    type: DataTypes.TEXT,
    field: 'detail_remark'
  }
}, {
  tableName: 'inventory_transaction_details',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

const InventoryBalance = sequelize.define('InventoryBalance', {
  balance_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'balance_id'
  },
  warehouse_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'warehouse_id'
  },
  location_id: {
    type: DataTypes.INTEGER,
    field: 'location_id'
  },
  item_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'item_id'
  },
  item_type: {
    type: DataTypes.TINYINT,
    allowNull: false,
    field: 'item_type'
  },
  batch_no: {
    type: DataTypes.STRING(50),
    field: 'batch_no'
  },
  quantity: {
    type: DataTypes.DECIMAL(10, 3),
    allowNull: false,
    defaultValue: 0,
    field: 'quantity'
  },
  reserved_quantity: {
    type: DataTypes.DECIMAL(10, 3),
    allowNull: false,
    defaultValue: 0,
    field: 'reserved_quantity'
  },
  last_transaction_date: {
    type: DataTypes.DATE,
    field: 'last_transaction_date'
  }
}, {
  tableName: 'inventory_balances',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

const InventoryInTransit = sequelize.define('InventoryInTransit', {
  transit_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'transit_id'
  },
  component_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'component_id'
  },
  purchase_order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'purchase_order_id'
  },
  order_item_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'order_item_id'
  },
  expected_quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'expected_quantity'
  },
  received_quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'received_quantity'
  },
  expected_date: {
    type: DataTypes.DATEONLY,
    field: 'expected_date'
  },
  transit_status: {
    type: DataTypes.TINYINT,
    defaultValue: 1,
    field: 'transit_status'
  }
}, {
  tableName: 'inventory_in_transit',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = {
  InventoryTransaction,
  InventoryTransactionDetail,
  InventoryBalance,
  InventoryInTransit
};
