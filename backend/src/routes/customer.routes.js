const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer.controller');
// const authMiddleware = require('../middlewares/auth.middleware'); // 您可以后续添加认证

// 创建客户
router.post('/', customerController.createCustomer);

// 获取所有客户
router.get('/', customerController.getAllCustomers);

// 获取单个客户
router.get('/:id', customerController.getCustomerById);

// 更新客户
router.put('/:id', customerController.updateCustomer);

// 删除客户
router.delete('/:id', customerController.deleteCustomer);

module.exports = router; 