const express = require('express');
const router = express.Router();
const materielController = require('../controllers/materielController');

router.get('/', materielController.getAllMateriels);
router.post('/', materielController.createMateriel);
router.delete('/:id', materielController.deleteMateriel);
router.put('/:id', materielController.updateMateriel);

module.exports = router;
