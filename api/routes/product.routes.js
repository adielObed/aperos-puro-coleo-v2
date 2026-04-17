const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

const authController = require('../controllers/auth.controller');

router.get('/', productController.getProductos);

// Rutas protegidas (Solo Admin)
router.use(authController.protect);
router.use(authController.restrictTo('admin'));

router.post('/', productController.createProducto);
router.put('/:id', productController.updateProducto);
router.delete('/:id', productController.deleteProducto);

module.exports = router;
