const express = require('express');
const router = express.Router();
const warehouseController = require('../controllers/warehouse.controller');
// const authMiddleware = require('../middlewares/auth.middleware');

router.post('/', warehouseController.createWarehouse);
router.get('/', warehouseController.getAllWarehouses);
router.get('/:id', warehouseController.getWarehouseById);
router.put('/:id', warehouseController.updateWarehouse);
router.delete('/:id', warehouseController.deleteWarehouse);

// TODO: Add routes for locations if managed under warehouses (e.g., /:warehouseId/locations)

module.exports = router; 