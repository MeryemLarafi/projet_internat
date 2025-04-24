const express = require('express');
const router = express.Router();
const fournisseurController = require('../controllers/fournisseurController');

router.get('/', fournisseurController.getAllFournisseurs);
router.post('/', fournisseurController.createFournisseur);
router.delete('/:id', fournisseurController.deleteFournisseur);
router.put('/:id', fournisseurController.updateFournisseur);

module.exports = router;
