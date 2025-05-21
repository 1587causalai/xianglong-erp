const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { verifyToken, checkPermission } = require('../middlewares/auth.middleware');
const { BomHeader, BomDetail, Product, Component } = require('../models');
const sequelize = require('../config/database');

// 获取所有BOM
router.get('/', verifyToken, async (req, res) => {
  try {
    const boms = await BomHeader.findAll({
      include: [
        {
          model: Product,
          attributes: ['product_code', 'product_name']
        }
      ],
      order: [['bom_id', 'ASC']]
    });
    
    res.json({
      success: true,
      data: boms
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取BOM列表失败',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// 获取单个BOM及其明细
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const bom = await BomHeader.findByPk(req.params.id, {
      include: [
        {
          model: Product,
          attributes: ['product_code', 'product_name', 'product_spec', 'product_unit']
        },
        {
          model: BomDetail,
          include: [
            {
              model: Component,
              attributes: ['component_code', 'component_name', 'component_spec', 'component_unit']
            }
          ]
        }
      ]
    });
    
    if (!bom) {
      return res.status(404).json({
        success: false,
        message: 'BOM不存在'
      });
    }
    
    res.json({
      success: true,
      data: bom
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取BOM详情失败',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// 创建BOM
router.post('/', 
  verifyToken, 
  checkPermission('bom:manage'),
  [
    body('product_id').isInt().withMessage('产品ID必须是整数'),
    body('bom_version').notEmpty().withMessage('BOM版本不能为空'),
    body('details').isArray().withMessage('BOM明细必须是数组'),
    body('details.*.component_id').isInt().withMessage('配件ID必须是整数'),
    body('details.*.quantity').isFloat().withMessage('用量必须是数字')
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
      // 检查产品是否存在
      const product = await Product.findByPk(req.body.product_id);
      if (!product) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: '产品不存在'
        });
      }
      
      // 检查BOM版本是否已存在
      const existingBom = await BomHeader.findOne({
        where: {
          product_id: req.body.product_id,
          bom_version: req.body.bom_version
        }
      });
      
      if (existingBom) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: '该产品的BOM版本已存在'
        });
      }
      
      // 创建BOM头
      const bomHeader = await BomHeader.create({
        product_id: req.body.product_id,
        bom_version: req.body.bom_version,
        bom_status: req.body.bom_status || 1,
        bom_remark: req.body.bom_remark
      }, { transaction });
      
      // 创建BOM明细
      const bomDetails = [];
      for (const detail of req.body.details) {
        // 检查配件是否存在
        const component = await Component.findByPk(detail.component_id);
        if (!component) {
          await transaction.rollback();
          return res.status(404).json({
            success: false,
            message: `配件ID ${detail.component_id} 不存在`
          });
        }
        
        const bomDetail = await BomDetail.create({
          bom_id: bomHeader.bom_id,
          component_id: detail.component_id,
          quantity: detail.quantity,
          bom_detail_remark: detail.bom_detail_remark
        }, { transaction });
        
        bomDetails.push(bomDetail);
      }
      
      await transaction.commit();
      
      res.status(201).json({
        success: true,
        message: 'BOM创建成功',
        data: {
          bomHeader,
          bomDetails
        }
      });
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({
        success: false,
        message: '创建BOM失败',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

// 更新BOM
router.put('/:id', 
  verifyToken, 
  checkPermission('bom:manage'),
  [
    body('bom_version').notEmpty().withMessage('BOM版本不能为空'),
    body('details').optional().isArray().withMessage('BOM明细必须是数组'),
    body('details.*.component_id').optional().isInt().withMessage('配件ID必须是整数'),
    body('details.*.quantity').optional().isFloat().withMessage('用量必须是数字')
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
      // 检查BOM是否存在
      const bomHeader = await BomHeader.findByPk(req.params.id);
      if (!bomHeader) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: 'BOM不存在'
        });
      }
      
      // 如果更新了BOM版本，检查是否与其他BOM冲突
      if (req.body.bom_version && req.body.bom_version !== bomHeader.bom_version) {
        const existingBom = await BomHeader.findOne({
          where: {
            product_id: bomHeader.product_id,
            bom_version: req.body.bom_version,
            bom_id: { [Op.ne]: bomHeader.bom_id }
          }
        });
        
        if (existingBom) {
          await transaction.rollback();
          return res.status(400).json({
            success: false,
            message: '该产品的BOM版本已存在'
          });
        }
      }
      
      // 更新BOM头
      await bomHeader.update({
        bom_version: req.body.bom_version,
        bom_status: req.body.bom_status !== undefined ? req.body.bom_status : bomHeader.bom_status,
        bom_remark: req.body.bom_remark !== undefined ? req.body.bom_remark : bomHeader.bom_remark
      }, { transaction });
      
      // 如果提供了明细，更新BOM明细
      if (req.body.details && req.body.details.length > 0) {
        // 删除现有明细
        await BomDetail.destroy({
          where: { bom_id: bomHeader.bom_id }
        }, { transaction });
        
        // 创建新明细
        const bomDetails = [];
        for (const detail of req.body.details) {
          // 检查配件是否存在
          const component = await Component.findByPk(detail.component_id);
          if (!component) {
            await transaction.rollback();
            return res.status(404).json({
              success: false,
              message: `配件ID ${detail.component_id} 不存在`
            });
          }
          
          const bomDetail = await BomDetail.create({
            bom_id: bomHeader.bom_id,
            component_id: detail.component_id,
            quantity: detail.quantity,
            bom_detail_remark: detail.bom_detail_remark
          }, { transaction });
          
          bomDetails.push(bomDetail);
        }
      }
      
      await transaction.commit();
      
      res.json({
        success: true,
        message: 'BOM更新成功',
        data: bomHeader
      });
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({
        success: false,
        message: '更新BOM失败',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

// 删除BOM
router.delete('/:id', 
  verifyToken, 
  checkPermission('bom:manage'),
  async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
      const bomHeader = await BomHeader.findByPk(req.params.id);
      
      if (!bomHeader) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: 'BOM不存在'
        });
      }
      
      // 检查BOM是否已被使用（订单、生产等）
      // TODO: 实现关联检查逻辑
      
      // 软删除（更改状态）
      await bomHeader.update({ bom_status: 0 }, { transaction });
      
      await transaction.commit();
      
      res.json({
        success: true,
        message: 'BOM已禁用'
      });
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({
        success: false,
        message: '禁用BOM失败',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

module.exports = router;
