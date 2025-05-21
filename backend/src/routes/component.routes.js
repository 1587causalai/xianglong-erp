const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { verifyToken, checkPermission } = require('../middlewares/auth.middleware');
const { Component } = require('../models');

// 获取所有配件
router.get('/', verifyToken, async (req, res) => {
  try {
    const components = await Component.findAll({
      order: [['component_code', 'ASC']]
    });
    
    res.json({
      success: true,
      data: components
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取配件列表失败',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// 获取单个配件
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const component = await Component.findByPk(req.params.id);
    
    if (!component) {
      return res.status(404).json({
        success: false,
        message: '配件不存在'
      });
    }
    
    res.json({
      success: true,
      data: component
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取配件详情失败',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// 创建配件
router.post('/', 
  verifyToken, 
  checkPermission('component:manage'),
  [
    body('component_code').notEmpty().withMessage('配件编码不能为空'),
    body('component_name').notEmpty().withMessage('配件名称不能为空')
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
      // 检查配件编码是否已存在
      const existingComponent = await Component.findOne({
        where: { component_code: req.body.component_code }
      });
      
      if (existingComponent) {
        return res.status(400).json({
          success: false,
          message: '配件编码已存在'
        });
      }
      
      // 创建新配件
      const component = await Component.create(req.body);
      
      res.status(201).json({
        success: true,
        message: '配件创建成功',
        data: component
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: '创建配件失败',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

// 更新配件
router.put('/:id', 
  verifyToken, 
  checkPermission('component:manage'),
  [
    body('component_name').notEmpty().withMessage('配件名称不能为空')
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
      const component = await Component.findByPk(req.params.id);
      
      if (!component) {
        return res.status(404).json({
          success: false,
          message: '配件不存在'
        });
      }
      
      // 如果更新了配件编码，检查是否与其他配件冲突
      if (req.body.component_code && req.body.component_code !== component.component_code) {
        const existingComponent = await Component.findOne({
          where: { component_code: req.body.component_code }
        });
        
        if (existingComponent) {
          return res.status(400).json({
            success: false,
            message: '配件编码已存在'
          });
        }
      }
      
      // 更新配件
      await component.update(req.body);
      
      res.json({
        success: true,
        message: '配件更新成功',
        data: component
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: '更新配件失败',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

// 删除配件
router.delete('/:id', 
  verifyToken, 
  checkPermission('component:manage'),
  async (req, res) => {
    try {
      const component = await Component.findByPk(req.params.id);
      
      if (!component) {
        return res.status(404).json({
          success: false,
          message: '配件不存在'
        });
      }
      
      // 检查配件是否已被使用（BOM、订单等）
      // TODO: 实现关联检查逻辑
      
      // 软删除（更改状态）
      await component.update({ component_status: 0 });
      
      res.json({
        success: true,
        message: '配件已禁用'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: '禁用配件失败',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

module.exports = router;
