const express = require('express');
const router = express.Router();
const chambreController = require('../controllers/chambreController');

router.get('/', chambreController.getAllChambres);
router.post('/', chambreController.createChambre);
router.put('/:id', chambreController.updateChambre);
router.delete('/:id', chambreController.deleteChambre);

module.exports = router;
