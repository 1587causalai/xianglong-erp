const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const InvoiceReceivable = sequelize.define('InvoiceReceivable', {
  invoice_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'invoice_id'
  },
  invoice_no: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    field: 'invoice_no'
  },
  invoice_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'invoice_date'
  },
  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'customer_id'
  },
  sales_order_id: {
    type: DataTypes.INTEGER,
    field: 'sales_order_id'
  },
  invoice_amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    field: 'invoice_amount'
  },
  tax_amount: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0,
    field: 'tax_amount'
  },
  total_amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    field: 'total_amount'
  },
  invoice_status: {
    type: DataTypes.TINYINT,
    defaultValue: 0,
    field: 'invoice_status'
  },
  due_date: {
    type: DataTypes.DATEONLY,
    field: 'due_date'
  },
  invoice_remark: {
    type: DataTypes.TEXT,
    field: 'invoice_remark'
  },
  created_by: {
    type: DataTypes.STRING(50),
    field: 'created_by'
  }
}, {
  tableName: 'invoices_receivable',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

const InvoicePayable = sequelize.define('InvoicePayable', {
  invoice_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'invoice_id'
  },
  invoice_no: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    field: 'invoice_no'
  },
  invoice_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'invoice_date'
  },
  supplier_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'supplier_id'
  },
  purchase_order_id: {
    type: DataTypes.INTEGER,
    field: 'purchase_order_id'
  },
  invoice_amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    field: 'invoice_amount'
  },
  tax_amount: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0,
    field: 'tax_amount'
  },
  total_amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    field: 'total_amount'
  },
  invoice_status: {
    type: DataTypes.TINYINT,
    defaultValue: 0,
    field: 'invoice_status'
  },
  due_date: {
    type: DataTypes.DATEONLY,
    field: 'due_date'
  },
  invoice_remark: {
    type: DataTypes.TEXT,
    field: 'invoice_remark'
  },
  created_by: {
    type: DataTypes.STRING(50),
    field: 'created_by'
  }
}, {
  tableName: 'invoices_payable',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

const AccountReceivable = sequelize.define('AccountReceivable', {
  ar_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'ar_id'
  },
  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'customer_id'
  },
  invoice_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'invoice_id'
  },
  original_amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    field: 'original_amount'
  },
  remaining_amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    field: 'remaining_amount'
  },
  due_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'due_date'
  },
  ar_status: {
    type: DataTypes.TINYINT,
    defaultValue: 1,
    field: 'ar_status'
  },
  ar_remark: {
    type: DataTypes.TEXT,
    field: 'ar_remark'
  }
}, {
  tableName: 'accounts_receivable',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

const AccountPayable = sequelize.define('AccountPayable', {
  ap_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'ap_id'
  },
  supplier_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'supplier_id'
  },
  invoice_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'invoice_id'
  },
  original_amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    field: 'original_amount'
  },
  remaining_amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    field: 'remaining_amount'
  },
  due_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'due_date'
  },
  ap_status: {
    type: DataTypes.TINYINT,
    defaultValue: 1,
    field: 'ap_status'
  },
  ap_remark: {
    type: DataTypes.TEXT,
    field: 'ap_remark'
  }
}, {
  tableName: 'accounts_payable',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = {
  InvoiceReceivable,
  InvoicePayable,
  AccountReceivable,
  AccountPayable
};
