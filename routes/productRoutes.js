const express = require('express');
const router = express.Router();
const productController = require('../controllers/productControllers');



router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/add', productController.addProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
