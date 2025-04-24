const express = require('express');
const router = express.Router();
const cuisineController = require('../controllers/cuisineController');

router.get('/', cuisineController.getAllCuisine);
router.post('/', cuisineController.createCuisine);
router.delete('/:id', cuisineController.deleteCuisine);
router.put('/:id', cuisineController.updateCuisine);

module.exports = router;
