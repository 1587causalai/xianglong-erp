const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { verifyToken, checkPermission } = require('../middlewares/auth.middleware');
const { PurchaseOrder, PurchaseOrderItem, Component, Supplier, InventoryInTransit } = require('../models');
const sequelize = require('../config/database');

// 获取采购订单列表
router.get('/', verifyToken, async (req, res) => {
  try {
    const purchaseOrders = await PurchaseOrder.findAll({
      include: [
        {
          model: Supplier,
          attributes: ['supplier_name']
        }
      ],
      order: [['order_date', 'DESC']]
    });
    
    res.json({
      success: true,
      data: purchaseOrders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取采购订单列表失败',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// 获取单个采购订单详情
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const purchaseOrder = await PurchaseOrder.findByPk(req.params.id, {
      include: [
        {
          model: Supplier,
          attributes: ['supplier_name', 'supplier_contact', 'supplier_phone']
        },
        {
          model: PurchaseOrderItem,
          include: [
            {
              model: Component,
              attributes: ['component_code', 'component_name', 'component_spec', 'component_unit']
            }
          ]
        }
      ]
    });
    
    if (!purchaseOrder) {
      return res.status(404).json({
        success: false,
        message: '采购订单不存在'
      });
    }
    
    res.json({
      success: true,
      data: purchaseOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取采购订单详情失败',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// 创建采购订单
router.post('/', 
  verifyToken, 
  checkPermission('purchase_order:manage'),
  [
    body('supplier_id').isInt().withMessage('供应商ID必须是整数'),
    body('order_date').isDate().withMessage('订单日期格式不正确'),
    body('items').isArray().withMessage('订单明细必须是数组'),
    body('items.*.component_id').isInt().withMessage('配件ID必须是整数'),
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
      const orderNo = `PO${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      
      // 计算订单总金额
      let totalAmount = 0;
      for (const item of req.body.items) {
        totalAmount += item.quantity * item.unit_price;
      }
      
      // 创建采购订单
      const purchaseOrder = await PurchaseOrder.create({
        order_no: orderNo,
        supplier_id: req.body.supplier_id,
        order_date: req.body.order_date,
        expected_date: req.body.expected_date,
        order_status: req.body.order_status || 0,
        total_amount: totalAmount,
        order_remark: req.body.order_remark,
        created_by: req.user.username
      }, { transaction });
      
      // 创建订单明细
      const orderItems = [];
      for (const item of req.body.items) {
        // 检查配件是否存在
        const component = await Component.findByPk(item.component_id);
        if (!component) {
          await transaction.rollback();
          return res.status(404).json({
            success: false,
            message: `配件ID ${item.component_id} 不存在`
          });
        }
        
        const lineAmount = item.quantity * item.unit_price;
        
        const orderItem = await PurchaseOrderItem.create({
          purchase_order_id: purchaseOrder.purchase_order_id,
          component_id: item.component_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          line_amount: lineAmount,
          received_quantity: 0,
          item_status: 0,
          item_remark: item.item_remark
        }, { transaction });
        
        orderItems.push(orderItem);
      }
      
      await transaction.commit();
      
      res.status(201).json({
        success: true,
        message: '采购订单创建成功',
        data: {
          purchaseOrder,
          orderItems
        }
      });
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({
        success: false,
        message: '创建采购订单失败',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

// 更新采购订单
router.put('/:id', 
  verifyToken, 
  checkPermission('purchase_order:manage'),
  async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
      const purchaseOrder = await PurchaseOrder.findByPk(req.params.id);
      
      if (!purchaseOrder) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: '采购订单不存在'
        });
      }
      
      // 只允许更新草稿状态的订单
      if (purchaseOrder.order_status > 0 && !req.body.force_update) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: '只能更新草稿状态的订单'
        });
      }
      
      // 更新订单基本信息
      const updateData = {};
      if (req.body.supplier_id) updateData.supplier_id = req.body.supplier_id;
      if (req.body.order_date) updateData.order_date = req.body.order_date;
      if (req.body.expected_date !== undefined) updateData.expected_date = req.body.expected_date;
      if (req.body.order_status !== undefined) updateData.order_status = req.body.order_status;
      if (req.body.order_remark !== undefined) updateData.order_remark = req.body.order_remark;
      
      // 如果提供了订单明细，更新明细
      if (req.body.items && req.body.items.length > 0 && purchaseOrder.order_status === 0) {
        // 删除现有明细
        await PurchaseOrderItem.destroy({
          where: { purchase_order_id: purchaseOrder.purchase_order_id }
        }, { transaction });
        
        // 计算新的订单总金额
        let totalAmount = 0;
        
        // 创建新明细
        for (const item of req.body.items) {
          // 检查配件是否存在
          const component = await Component.findByPk(item.component_id);
          if (!component) {
            await transaction.rollback();
            return res.status(404).json({
              success: false,
              message: `配件ID ${item.component_id} 不存在`
            });
          }
          
          const lineAmount = item.quantity * item.unit_price;
          totalAmount += lineAmount;
          
          await PurchaseOrderItem.create({
            purchase_order_id: purchaseOrder.purchase_order_id,
            component_id: item.component_id,
            quantity: item.quantity,
            unit_price: item.unit_price,
            line_amount: lineAmount,
            received_quantity: 0,
            item_status: 0,
            item_remark: item.item_remark
          }, { transaction });
        }
        
        updateData.total_amount = totalAmount;
      }
      
      // 更新订单
      await purchaseOrder.update(updateData, { transaction });
      
      await transaction.commit();
      
      res.json({
        success: true,
        message: '采购订单更新成功',
        data: purchaseOrder
      });
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({
        success: false,
        message: '更新采购订单失败',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

// 确认采购订单（发送给供应商）
router.post('/:id/confirm', 
  verifyToken, 
  checkPermission('purchase_order:manage'),
  async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
      const purchaseOrder = await PurchaseOrder.findByPk(req.params.id, {
        include: [
          {
            model: PurchaseOrderItem
          }
        ]
      });
      
      if (!purchaseOrder) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: '采购订单不存在'
        });
      }
      
      // 只允许确认草稿状态的订单
      if (purchaseOrder.order_status !== 0) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: '只能确认草稿状态的订单'
        });
      }
      
      // 更新订单状态为已发送
      await purchaseOrder.update({ order_status: 1 }, { transaction });
      
      // 创建在途库存记录（触发器会自动处理）
      
      await transaction.commit();
      
      res.json({
        success: true,
        message: '采购订单已确认',
        data: purchaseOrder
      });
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({
        success: false,
        message: '确认采购订单失败',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

// 取消采购订单
router.post('/:id/cancel', 
  verifyToken, 
  checkPermission('purchase_order:manage'),
  async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
      const purchaseOrder = await PurchaseOrder.findByPk(req.params.id);
      
      if (!purchaseOrder) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: '采购订单不存在'
        });
      }
      
      // 只允许取消未完成的订单
      if (purchaseOrder.order_status >= 4) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: '无法取消已完成的订单'
        });
      }
      
      // 更新订单状态为取消
      await purchaseOrder.update({ order_status: 5 }, { transaction });
      
      // 更新在途库存状态（触发器会自动处理）
      
      await transaction.commit();
      
      res.json({
        success: true,
        message: '采购订单已取消',
        data: purchaseOrder
      });
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({
        success: false,
        message: '取消采购订单失败',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

// 记录采购收货
router.post('/:id/receive', 
  verifyToken, 
  checkPermission('purchase_order:manage'),
  [
    body('items').isArray().withMessage('收货明细必须是数组'),
    body('items.*.order_item_id').isInt().withMessage('订单明细ID必须是整数'),
    body('items.*.received_quantity').isInt().withMessage('收货数量必须是整数'),
    body('warehouse_id').isInt().withMessage('仓库ID必须是整数')
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
      const purchaseOrder = await PurchaseOrder.findByPk(req.params.id, {
        include: [
          {
            model: PurchaseOrderItem
          }
        ]
      });
      
      if (!purchaseOrder) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: '采购订单不存在'
        });
      }
      
      // 只允许对已发送、部分到货的订单进行收货
      if (purchaseOrder.order_status !== 1 && purchaseOrder.order_status !== 2) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: '只能对已发送或部分到货的订单进行收货'
        });
      }
      
      // 生成库存事务编号
      const transactionNo = `GR${Date.now()}${Math.floor(Math.random() * 1000)}`;
      
      // 创建库存事务
      const inventoryTransaction = await InventoryTransaction.create({
        transaction_no: transactionNo,
        transaction_type: 1, // 采购入库
        transaction_date: new Date(),
        reference_no: purchaseOrder.order_no,
        reference_type: '采购订单',
        warehouse_id: req.body.warehouse_id,
        transaction_status: 1,
        transaction_remark: req.body.transaction_remark || '采购收货',
        created_by: req.user.username
      }, { transaction });
      
      // 处理每个收货明细
      let allItemsReceived = true;
      
      for (const item of req.body.items) {
        // 查找订单明细
        const orderItem = purchaseOrder.PurchaseOrderItems.find(
          oi => oi.order_item_id === item.order_item_id
        );
        
        if (!orderItem) {
          await transaction.rollback();
          return res.status(404).json({
            success: false,
            message: `订单明细ID ${item.order_item_id} 不存在`
          });
        }
        
        // 计算新的已收货数量
        const newReceivedQuantity = orderItem.received_quantity + item.received_quantity;
        
        // 检查收货数量是否超过订单数量
        if (newReceivedQuantity > orderItem.quantity && !req.body.allow_over_receipt) {
          await transaction.rollback();
          return res.status(400).json({
            success: false,
            message: `收货数量超过订单数量，配件ID: ${orderItem.component_id}`
          });
        }
        
        // 更新订单明细的已收货数量和状态
        const itemStatus = newReceivedQuantity >= orderItem.quantity ? 2 : 1;
        await orderItem.update({
          received_quantity: newReceivedQuantity,
          item_status: itemStatus
        }, { transaction });
        
        // 检查是否所有明细都已完全收货
        if (itemStatus !== 2) {
          allItemsReceived = false;
        }
        
        // 创建库存事务明细
        await InventoryTransactionDetail.create({
          transaction_id: inventoryTransaction.transaction_id,
          item_id: orderItem.component_id,
          item_type: 2, // 配件
          location_id: item.location_id,
          quantity: item.received_quantity,
          unit_cost: orderItem.unit_price,
          batch_no: item.batch_no,
          detail_remark: item.detail_remark || '采购收货'
        }, { transaction });
        
        // 更新库存余额
        const balanceKey = {
          warehouse_id: req.body.warehouse_id,
          location_id: item.location_id,
          item_id: orderItem.component_id,
          item_type: 2, // 配件
          batch_no: item.batch_no || null
        };
        
        let balance = await InventoryBalance.findOne({
          where: balanceKey
        });
        
        if (balance) {
          // 更新现有库存
          await balance.update({
            quantity: sequelize.literal(`quantity + ${item.received_quantity}`),
            last_transaction_date: new Date()
          }, { transaction });
        } else {
          // 创建新库存记录
          await InventoryBalance.create({
            ...balanceKey,
            quantity: item.received_quantity,
            reserved_quantity: 0,
            last_transaction_date: new Date()
          }, { transaction });
        }
        
        // 更新在途库存
        await InventoryInTransit.update(
          {
            received_quantity: sequelize.literal(`received_quantity + ${item.received_quantity}`),
            transit_status: newReceivedQuantity >= orderItem.quantity ? 3 : 2
          },
          {
            where: {
              order_item_id: orderItem.order_item_id
            },
            transaction
          }
        );
      }
      
      // 更新订单状态
      const newOrderStatus = allItemsReceived ? 3 : 2; // 全部到货或部分到货
      await purchaseOrder.update({ order_status: newOrderStatus }, { transaction });
      
      await transaction.commit();
      
      res.json({
        success: true,
        message: '采购收货成功',
        data: {
          purchaseOrder,
          inventoryTransaction
        }
      });
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({
        success: false,
        message: '采购收货失败',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

module.exports = router;
