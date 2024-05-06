const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderControllers');

router.get('/', orderController.getAllOrders);
router.get('/:id', orderController.getOrderById);
router.post('/add', orderController.addOrder);
router.put('/:id', orderController.updateOrder);
router.delete('/:id', orderController.deleteOrder);

module.exports = router;


