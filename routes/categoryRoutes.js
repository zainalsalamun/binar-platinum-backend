const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryControllers');

router.get('/', categoryController.getAllCategories);
router.post('/', categoryController.addCategory);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
