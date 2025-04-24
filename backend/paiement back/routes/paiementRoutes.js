const express = require('express');
const router = express.Router();
const paiementController = require('../controllers/paiementController');

router.get('/', paiementController.getAllPaiements);
router.post('/', paiementController.createPaiement);
router.put('/:id', paiementController.updatePaiement);
router.delete('/:id', paiementController.deletePaiement);

module.exports = router;
