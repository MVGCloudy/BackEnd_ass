const express = require('express');
const productController = require('../controllers/productController');
const uploadMiddleware = require('../middleware/uploadMiddleware');

const router = express.Router();

router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.post('/', uploadMiddleware.single('image_file'), productController.createProduct);
router.put('/:id', uploadMiddleware.single('image_file'), productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
