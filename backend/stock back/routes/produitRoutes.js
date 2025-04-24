const express = require('express');
const router = express.Router();
const produitController = require('../controllers/produitController');

router.get('/', produitController.getAllProduits);
router.post('/', produitController.createProduit);
router.delete('/:id', produitController.deleteProduit);
router.put('/:id', produitController.updateProduit);

module.exports = router;
