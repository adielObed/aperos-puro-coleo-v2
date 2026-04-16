const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');

const authController = require('../controllers/auth.controller');

router.get('/', categoryController.getCategories);

// Rutas protegidas (Solo Admin)
router.use(authController.protect);
router.use(authController.restrictTo('admin'));

router.post('/', categoryController.createCategory);

module.exports = router;
