const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { verifyToken, checkPermission } = require('../middlewares/auth.middleware');
const { Product } = require('../models');

// 获取所有产品
router.get('/', verifyToken, async (req, res) => {
  try {
    const products = await Product.findAll({
      order: [['product_code', 'ASC']]
    });
    
    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取产品列表失败',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// 获取单个产品
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: '产品不存在'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取产品详情失败',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// 创建产品
router.post('/', 
  verifyToken, 
  checkPermission('product:manage'),
  [
    body('product_code').notEmpty().withMessage('产品编码不能为空'),
    body('product_name').notEmpty().withMessage('产品名称不能为空')
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
    
    try {
      // 检查产品编码是否已存在
      const existingProduct = await Product.findOne({
        where: { product_code: req.body.product_code }
      });
      
      if (existingProduct) {
        return res.status(400).json({
          success: false,
          message: '产品编码已存在'
        });
      }
      
      // 创建新产品
      const product = await Product.create(req.body);
      
      res.status(201).json({
        success: true,
        message: '产品创建成功',
        data: product
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: '创建产品失败',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

// 更新产品
router.put('/:id', 
  verifyToken, 
  checkPermission('product:manage'),
  [
    body('product_name').notEmpty().withMessage('产品名称不能为空')
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
    
    try {
      const product = await Product.findByPk(req.params.id);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: '产品不存在'
        });
      }
      
      // 如果更新了产品编码，检查是否与其他产品冲突
      if (req.body.product_code && req.body.product_code !== product.product_code) {
        const existingProduct = await Product.findOne({
          where: { product_code: req.body.product_code }
        });
        
        if (existingProduct) {
          return res.status(400).json({
            success: false,
            message: '产品编码已存在'
          });
        }
      }
      
      // 更新产品
      await product.update(req.body);
      
      res.json({
        success: true,
        message: '产品更新成功',
        data: product
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: '更新产品失败',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

// 删除产品
router.delete('/:id', 
  verifyToken, 
  checkPermission('product:manage'),
  async (req, res) => {
    try {
      const product = await Product.findByPk(req.params.id);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: '产品不存在'
        });
      }
      
      // 检查产品是否已被使用（BOM、订单等）
      // TODO: 实现关联检查逻辑
      
      // 软删除（更改状态）
      await product.update({ product_status: 0 });
      
      res.json({
        success: true,
        message: '产品已禁用'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: '禁用产品失败',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

module.exports = router;
