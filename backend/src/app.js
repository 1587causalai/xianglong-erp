const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

// 数据库连接
const sequelize = require('./config/database');

// 路由导入
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const componentRoutes = require('./routes/component.routes');
const bomRoutes = require('./routes/bom.routes');
const customerRoutes = require('./routes/customer.routes');
const supplierRoutes = require('./routes/supplier.routes');
const warehouseRoutes = require('./routes/warehouse.routes');
const salesOrderRoutes = require('./routes/salesOrder.routes');
const purchaseOrderRoutes = require('./routes/purchaseOrder.routes');
const inventoryRoutes = require('./routes/inventory.routes');
const financeRoutes = require('./routes/finance.routes');

const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// 静态文件
app.use(express.static(path.join(__dirname, '../public')));

// API路由
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/components', componentRoutes);
app.use('/api/bom', bomRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/warehouses', warehouseRoutes);
app.use('/api/sales-orders', salesOrderRoutes);
app.use('/api/purchase-orders', purchaseOrderRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/finance', financeRoutes);

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: '服务器内部错误',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 启动服务器
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // 测试数据库连接
    await sequelize.authenticate();
    console.log('数据库连接成功');
    
    // 同步数据库模型（开发环境使用）
    if (process.env.NODE_ENV === 'development') {
      // await sequelize.sync({ force: true }); // 谨慎使用，会删除所有表
      await sequelize.sync({ alter: true });
      console.log('数据库模型同步完成');
    }
    
    app.listen(PORT, () => {
      console.log(`服务器运行在端口 ${PORT}`);
    });
  } catch (error) {
    console.error('无法启动服务器:', error);
  }
}

startServer();

module.exports = app;
