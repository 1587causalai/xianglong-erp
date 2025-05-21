const jwt = require('jsonwebtoken');
const { User } = require('../models');

// 验证JWT令牌
exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: '未提供访问令牌'
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 检查用户是否存在
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '用户不存在'
      });
    }
    
    // 检查用户状态
    if (user.user_status !== 1) {
      return res.status(403).json({
        success: false,
        message: '用户已被禁用'
      });
    }
    
    // 将用户信息添加到请求对象
    req.user = user;
    
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: '无效的访问令牌',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// 检查用户权限
exports.checkPermission = (permissionCode) => {
  return async (req, res, next) => {
    try {
      const user = req.user;
      
      // 获取用户角色的权限
      const userRole = await user.getRole({
        include: [{
          model: Permission,
          attributes: ['permission_code']
        }]
      });
      
      if (!userRole) {
        return res.status(403).json({
          success: false,
          message: '用户没有分配角色'
        });
      }
      
      // 检查是否有所需权限
      const hasPermission = userRole.Permissions.some(
        permission => permission.permission_code === permissionCode
      );
      
      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: '没有执行此操作的权限'
        });
      }
      
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: '权限检查失败',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  };
};
