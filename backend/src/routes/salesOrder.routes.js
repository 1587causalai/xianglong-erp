const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { verifyToken, checkPermission } = require('../middlewares/auth.middleware');
const { SalesOrder, SalesOrderItem, Product, Customer } = require('../models');
const sequelize = require('../config/database');

// 获取销售订单列表
router.get('/', verifyToken, async (req, res) => {
  try {
    const salesOrders = await SalesOrder.findAll({
      include: [
        {
          model: Customer,
          attributes: ['customer_name']
        }
      ],
      order: [['order_date', 'DESC']]
    });
    
    res.json({
      success: true,
      data: salesOrders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取销售订单列表失败',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// 获取单个销售订单详情
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const salesOrder = await SalesOrder.findByPk(req.params.id, {
      include: [
        {
          model: Customer,
          attributes: ['customer_name', 'customer_contact', 'customer_phone']
        },
        {
          model: SalesOrderItem,
          include: [
            {
              model: Product,
              attributes: ['product_code', 'product_name', 'product_spec', 'product_unit']
            }
          ]
        }
      ]
    });
    
    if (!salesOrder) {
      return res.status(404).json({
        success: false,
        message: '销售订单不存在'
      });
    }
    
    res.json({
      success: true,
      data: salesOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取销售订单详情失败',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// 创建销售订单
router.post('/', 
  verifyToken, 
  checkPermission('sales_order:manage'),
  [
    body('customer_id').isInt().withMessage('客户ID必须是整数'),
    body('order_date').isDate().withMessage('订单日期格式不正确'),
    body('items').isArray().withMessage('订单明细必须是数组'),
    body('items.*.product_id').isInt().withMessage('产品ID必须是整数'),
    body('items.*.quantity').isInt().withMessage('数量必须是整数'),
    body('items.*.unit_price').isFloat().withMessage('单价必须是数字')
  ],
  async (req, res) => {
    // 验证请求
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '验证失败',
        errors: errors.array()
      });
    }
    
    const transaction = await sequelize.transaction();
    
    try {
      // 生成订单编号
      const orderNo = `SO${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      
      // 计算订单总金额
      let totalAmount = 0;
      for (const item of req.body.items) {
        totalAmount += item.quantity * item.unit_price;
      }
      
      // 创建销售订单
      const salesOrder = await SalesOrder.create({
        order_no: orderNo,
        customer_id: req.body.customer_id,
        order_date: req.body.order_date,
        delivery_date: req.body.delivery_date,
        order_status: req.body.order_status || 0,
        total_amount: totalAmount,
        order_remark: req.body.order_remark,
        created_by: req.user.username
      }, { transaction });
      
      // 创建订单明细
      const orderItems = [];
      for (const item of req.body.items) {
        // 检查产品是否存在
        const product = await Product.findByPk(item.product_id);
        if (!product) {
          await transaction.rollback();
          return res.status(404).json({
            success: false,
            message: `产品ID ${item.product_id} 不存在`
          });
        }
        
        const lineAmount = item.quantity * item.unit_price;
        
        const orderItem = await SalesOrderItem.create({
          sales_order_id: salesOrder.sales_order_id,
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          line_amount: lineAmount,
          delivered_quantity: 0,
          item_status: 0,
          item_remark: item.item_remark
        }, { transaction });
        
        orderItems.push(orderItem);
      }
      
      await transaction.commit();
      
      res.status(201).json({
        success: true,
        message: '销售订单创建成功',
        data: {
          salesOrder,
          orderItems
        }
      });
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({
        success: false,
        message: '创建销售订单失败',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

// 更新销售订单
router.put('/:id', 
  verifyToken, 
  checkPermission('sales_order:manage'),
  async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
      const salesOrder = await SalesOrder.findByPk(req.params.id);
      
      if (!salesOrder) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: '销售订单不存在'
        });
      }
      
      // 只允许更新草稿状态的订单
      if (salesOrder.order_status > 0 && !req.body.force_update) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: '只能更新草稿状态的订单'
        });
      }
      
      // 更新订单基本信息
      const updateData = {};
      if (req.body.customer_id) updateData.customer_id = req.body.customer_id;
      if (req.body.order_date) updateData.order_date = req.body.order_date;
      if (req.body.delivery_date !== undefined) updateData.delivery_date = req.body.delivery_date;
      if (req.body.order_status !== undefined) updateData.order_status = req.body.order_status;
      if (req.body.order_remark !== undefined) updateData.order_remark = req.body.order_remark;
      
      // 如果提供了订单明细，更新明细
      if (req.body.items && req.body.items.length > 0 && salesOrder.order_status === 0) {
        // 删除现有明细
        await SalesOrderItem.destroy({
          where: { sales_order_id: salesOrder.sales_order_id }
        }, { transaction });
        
        // 计算新的订单总金额
        let totalAmount = 0;
        
        // 创建新明细
        for (const item of req.body.items) {
          // 检查产品是否存在
          const product = await Product.findByPk(item.product_id);
          if (!product) {
            await transaction.rollback();
            return res.status(404).json({
              success: false,
              message: `产品ID ${item.product_id} 不存在`
            });
          }
          
          const lineAmount = item.quantity * item.unit_price;
          totalAmount += lineAmount;
          
          await SalesOrderItem.create({
            sales_order_id: salesOrder.sales_order_id,
            product_id: item.product_id,
            quantity: item.quantity,
            unit_price: item.unit_price,
            line_amount: lineAmount,
            delivered_quantity: 0,
            item_status: 0,
            item_remark: item.item_remark
          }, { transaction });
        }
        
        updateData.total_amount = totalAmount;
      }
      
      // 更新订单
      await salesOrder.update(updateData, { transaction });
      
      await transaction.commit();
      
      res.json({
        success: true,
        message: '销售订单更新成功',
        data: salesOrder
      });
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({
        success: false,
        message: '更新销售订单失败',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

// 取消销售订单
router.post('/:id/cancel', 
  verifyToken, 
  checkPermission('sales_order:manage'),
  async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
      const salesOrder = await SalesOrder.findByPk(req.params.id);
      
      if (!salesOrder) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: '销售订单不存在'
        });
      }
      
      // 只允许取消未完成的订单
      if (salesOrder.order_status >= 4) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: '无法取消已完成的订单'
        });
      }
      
      // 更新订单状态为取消
      await salesOrder.update({ order_status: 5 }, { transaction });
      
      await transaction.commit();
      
      res.json({
        success: true,
        message: '销售订单已取消',
        data: salesOrder
      });
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({
        success: false,
        message: '取消销售订单失败',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

// 确认销售订单
router.post('/:id/confirm', 
  verifyToken, 
  checkPermission('sales_order:manage'),
  async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
      const salesOrder = await SalesOrder.findByPk(req.params.id);
      
      if (!salesOrder) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: '销售订单不存在'
        });
      }
      
      // 只允许确认草稿状态的订单
      if (salesOrder.order_status !== 0) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: '只能确认草稿状态的订单'
        });
      }
      
      // 更新订单状态为确认
      await salesOrder.update({ order_status: 1 }, { transaction });
      
      await transaction.commit();
      
      res.json({
        success: true,
        message: '销售订单已确认',
        data: salesOrder
      });
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({
        success: false,
        message: '确认销售订单失败',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

module.exports = router;
