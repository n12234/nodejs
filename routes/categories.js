const express = require('express');
const router = express.Router();

const categoriesController = require('../controllers/CategoriesController');

router.get('/list', categoriesController.getListCategory)
router.get('/', categoriesController.getAllCategories);
router.get('/:id', categoriesController.getCategoryDetail);
router.post('/', categoriesController.createCategory);
router.put('/:id', categoriesController.updateCategory);
router.delete('/:id', categoriesController.deleleCategory);

module.exports = router;
