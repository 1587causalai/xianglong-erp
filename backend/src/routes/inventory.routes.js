const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { verifyToken, checkPermission } = require('../middlewares/auth.middleware');
const { InventoryTransaction, InventoryTransactionDetail, InventoryBalance, InventoryInTransit, Product, Component, Warehouse, Location } = require('../models');
const sequelize = require('../config/database');

// 获取库存余额列表
router.get('/balances', verifyToken, async (req, res) => {
  try {
    const balances = await InventoryBalance.findAll({
      include: [
        {
          model: Warehouse,
          attributes: ['warehouse_name']
        },
        {
          model: Location,
          attributes: ['location_code']
        }
      ],
      order: [['item_id', 'ASC'], ['warehouse_id', 'ASC']]
    });
    
    // 处理结果，添加物料名称
    const result = [];
    for (const balance of balances) {
      let itemName = '';
      let itemCode = '';
      
      if (balance.item_type === 1) { // 产品
        const product = await Product.findByPk(balance.item_id);
        if (product) {
          itemName = product.product_name;
          itemCode = product.product_code;
        }
      } else if (balance.item_type === 2) { // 配件
        const component = await Component.findByPk(balance.item_id);
        if (component) {
          itemName = component.component_name;
          itemCode = component.component_code;
        }
      }
      
      result.push({
        ...balance.toJSON(),
        item_name: itemName,
        item_code: itemCode
      });
    }
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取库存余额失败',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// 获取在途库存列表
router.get('/in-transit', verifyToken, async (req, res) => {
  try {
    const inTransit = await InventoryInTransit.findAll({
      include: [
        {
          model: Component,
          attributes: ['component_code', 'component_name']
        }
      ],
      order: [['expected_date', 'ASC']]
    });
    
    res.json({
      success: true,
      data: inTransit
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取在途库存失败',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// 创建库存事务（入库、出库、调整等）
router.post('/transactions', 
  verifyToken, 
  checkPermission('inventory:manage'),
  [
    body('transaction_type').isInt().withMessage('事务类型必须是整数'),
    body('warehouse_id').isInt().withMessage('仓库ID必须是整数'),
    body('details').isArray().withMessage('事务明细必须是数组'),
    body('details.*.item_id').isInt().withMessage('物料ID必须是整数'),
    body('details.*.item_type').isInt().withMessage('物料类型必须是整数'),
    body('details.*.quantity').isFloat().withMessage('数量必须是数字'),
    body('details.*.location_id').optional().isInt().withMessage('库位ID必须是整数')
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
      // 生成事务编号
      const transactionNo = `T${Date.now()}${Math.floor(Math.random() * 1000)}`;
      
      // 创建库存事务
      const inventoryTransaction = await InventoryTransaction.create({
        transaction_no: transactionNo,
        transaction_type: req.body.transaction_type,
        transaction_date: req.body.transaction_date || new Date(),
        reference_no: req.body.reference_no,
        reference_type: req.body.reference_type,
        warehouse_id: req.body.warehouse_id,
        transaction_status: req.body.transaction_status || 1,
        transaction_remark: req.body.transaction_remark,
        created_by: req.user.username
      }, { transaction });
      
      // 创建事务明细并更新库存余额
      for (const detail of req.body.details) {
        // 创建事务明细
        await InventoryTransactionDetail.create({
          transaction_id: inventoryTransaction.transaction_id,
          item_id: detail.item_id,
          item_type: detail.item_type,
          location_id: detail.location_id,
          quantity: detail.quantity,
          unit_cost: detail.unit_cost,
          batch_no: detail.batch_no,
          detail_remark: detail.detail_remark
        }, { transaction });
        
        // 更新库存余额
        const balanceKey = {
          warehouse_id: req.body.warehouse_id,
          location_id: detail.location_id,
          item_id: detail.item_id,
          item_type: detail.item_type,
          batch_no: detail.batch_no || null
        };
        
        let balance = await InventoryBalance.findOne({
          where: balanceKey
        });
        
        if (balance) {
          // 更新现有库存
          await balance.update({
            quantity: sequelize.literal(`quantity + ${detail.quantity}`),
            last_transaction_date: new Date()
          }, { transaction });
        } else {
          // 创建新库存记录
          await InventoryBalance.create({
            ...balanceKey,
            quantity: detail.quantity,
            reserved_quantity: 0,
            last_transaction_date: new Date()
          }, { transaction });
        }
        
        // 如果是成品入库，且事务类型为4（成品入库），则自动扣减配件库存
        if (detail.item_type === 1 && req.body.transaction_type === 4) {
          // 调用存储过程扣减配件库存
          await sequelize.query(
            'CALL sp_product_stock_in(:p_transaction_id, :p_product_id, :p_warehouse_id, :p_location_id, :p_quantity, :p_batch_no, :p_created_by)',
            {
              replacements: {
                p_transaction_id: inventoryTransaction.transaction_id,
                p_product_id: detail.item_id,
                p_warehouse_id: req.body.warehouse_id,
                p_location_id: detail.location_id,
                p_quantity: detail.quantity,
                p_batch_no: detail.batch_no || null,
                p_created_by: req.user.username
              },
              transaction
            }
          );
        }
      }
      
      await transaction.commit();
      
      res.status(201).json({
        success: true,
        message: '库存事务创建成功',
        data: inventoryTransaction
      });
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({
        success: false,
        message: '创建库存事务失败',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

// 获取库存事务列表
router.get('/transactions', verifyToken, async (req, res) => {
  try {
    const transactions = await InventoryTransaction.findAll({
      include: [
        {
          model: Warehouse,
          attributes: ['warehouse_name']
        }
      ],
      order: [['transaction_date', 'DESC']]
    });
    
    res.json({
      success: true,
      data: transactions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取库存事务失败',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// 获取库存事务详情
router.get('/transactions/:id', verifyToken, async (req, res) => {
  try {
    const transaction = await InventoryTransaction.findByPk(req.params.id, {
      include: [
        {
          model: Warehouse,
          attributes: ['warehouse_name']
        },
        {
          model: InventoryTransactionDetail,
          include: [
            {
              model: Location,
              attributes: ['location_code']
            }
          ]
        }
      ]
    });
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: '库存事务不存在'
      });
    }
    
    // 处理结果，添加物料名称
    const details = [];
    for (const detail of transaction.InventoryTransactionDetails) {
      let itemName = '';
      let itemCode = '';
      
      if (detail.item_type === 1) { // 产品
        const product = await Product.findByPk(detail.item_id);
        if (product) {
          itemName = product.product_name;
          itemCode = product.product_code;
        }
      } else if (detail.item_type === 2) { // 配件
        const component = await Component.findByPk(detail.item_id);
        if (component) {
          itemName = component.component_name;
          itemCode = component.component_code;
        }
      }
      
      details.push({
        ...detail.toJSON(),
        item_name: itemName,
        item_code: itemCode
      });
    }
    
    const result = {
      ...transaction.toJSON(),
      InventoryTransactionDetails: details
    };
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取库存事务详情失败',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// 库存盘点调整
router.post('/adjustments', 
  verifyToken, 
  checkPermission('inventory:manage'),
  [
    body('warehouse_id').isInt().withMessage('仓库ID必须是整数'),
    body('items').isArray().withMessage('调整项目必须是数组'),
    body('items.*.item_id').isInt().withMessage('物料ID必须是整数'),
    body('items.*.item_type').isInt().withMessage('物料类型必须是整数'),
    body('items.*.location_id').isInt().withMessage('库位ID必须是整数'),
    body('items.*.actual_quantity').isFloat().withMessage('实际数量必须是数字')
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
      // 生成事务编号
      const transactionNo = `ADJ${Date.now()}${Math.floor(Math.random() * 1000)}`;
      
      // 创建库存事务
      const inventoryTransaction = await InventoryTransaction.create({
        transaction_no: transactionNo,
        transaction_type: 6, // 盘点调整
        transaction_date: req.body.transaction_date || new Date(),
        reference_no: req.body.reference_no,
        reference_type: '库存盘点',
        warehouse_id: req.body.warehouse_id,
        transaction_status: 1,
        transaction_remark: req.body.transaction_remark,
        created_by: req.user.username
      }, { transaction });
      
      // 处理每个调整项目
      for (const item of req.body.items) {
        // 获取当前库存
        const balance = await InventoryBalance.findOne({
          where: {
            warehouse_id: req.body.warehouse_id,
            location_id: item.location_id,
            item_id: item.item_id,
            item_type: item.item_type,
            batch_no: item.batch_no || null
          }
        });
        
        if (!balance) {
          // 如果库存不存在但实际数量大于0，则创建新库存
          if (item.actual_quantity > 0) {
            await InventoryBalance.create({
              warehouse_id: req.body.warehouse_id,
              location_id: item.location_id,
              item_id: item.item_id,
              item_type: item.item_type,
              batch_no: item.batch_no || null,
              quantity: item.actual_quantity,
              reserved_quantity: 0,
              last_transaction_date: new Date()
            }, { transaction });
            
            // 创建事务明细
            await InventoryTransactionDetail.create({
              transaction_id: inventoryTransaction.transaction_id,
              item_id: item.item_id,
              item_type: item.item_type,
              location_id: item.location_id,
              quantity: item.actual_quantity,
              batch_no: item.batch_no,
              detail_remark: '盘点新增'
            }, { transaction });
          }
        } else {
          // 计算差异
          const difference = item.actual_quantity - balance.quantity;
          
          if (difference !== 0) {
            // 更新库存
            await balance.update({
              quantity: item.actual_quantity,
              last_transaction_date: new Date()
            }, { transaction });
            
            // 创建事务明细
            await InventoryTransactionDetail.create({
              transaction_id: inventoryTransaction.transaction_id,
              item_id: item.item_id,
              item_type: item.item_type,
              location_id: item.location_id,
              quantity: difference,
              batch_no: item.batch_no,
              detail_remark: difference > 0 ? '盘点盈余' : '盘点亏损'
            }, { transaction });
          }
        }
      }
      
      await transaction.commit();
      
      res.status(201).json({
        success: true,
        message: '库存盘点调整成功',
        data: inventoryTransaction
      });
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({
        success: false,
        message: '库存盘点调整失败',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

module.exports = router;
