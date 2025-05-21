const express = require('express');
const router = express.Router();
const financeController = require('../controllers/finance.controller');
// const authMiddleware = require('../middlewares/auth.middleware');

// 占位 - 您需要根据实际的财务操作定义更具体的路由和控制器方法
router.get('/receivables', financeController.getReceivablesPlaceholder);
router.get('/payables', financeController.getPayablesPlaceholder);
router.get('/invoices', financeController.getInvoicesPlaceholder);
router.post('/receipts', financeController.createReceiptPlaceholder);
router.post('/payments', financeController.createPaymentPlaceholder);

// 基础占位
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Finance routes placeholder - GET /api/finance' });
});

module.exports = router; 