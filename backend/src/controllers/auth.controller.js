const db = require('../models'); // 加载模型（包含User）
const User = db.User; // 直接访问User模型，如果models/index.js正确导出了它
const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs'); // User模型内部已经使用了bcryptjs

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!User) {
        return res.status(500).json({ success: false, message: 'User model not found. Check server configuration.' });
    }

    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(401).json({ success: false, message: `认证失败：用户 '${username}' 不存在` });
    }

    // ---- 恢复密码验证 ----
    const isMatch = await user.validatePassword(password);
    if (!isMatch) {
      // 临时兼容MD5密码的逻辑（如果之前添加过，现在应该移除或妥善处理）
      // 考虑到我们要恢复"正式"验证，这里直接返回密码不正确
      return res.status(401).json({ success: false, message: '认证失败：密码不正确' });
    }
    // ---- 结束恢复 ----

    // 生成JWT
    const payload = {
      userId: user.user_id,
      username: user.username,
      roleId: user.role_id
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'your_very_secure_default_secret_key_for_dev', 
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' } // 正式环境建议使用更短的有效期或refresh token机制
    );

    const userResponse = user.toJSON();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      message: '登录成功', // 恢复正常提示信息
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: '服务器内部错误', error: error.message });
  }
};

exports.getMe = async (req, res) => {
  // req.user 由 verifyToken 中间件从JWT中解析并设置
  if (!req.user || !req.user.user_id) { 
    return res.status(401).json({ success: false, message: 'Token无效或用户标识缺失' });
  }
  try {
    // req.user 本身已经是User模型实例了
    const userInstance = req.user;
    const userResponse = userInstance.toJSON();
    delete userResponse.password;

    res.status(200).json({ success: true, user: userResponse });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({ success: false, message: '获取用户信息失败', error: error.message });
  }
}; 