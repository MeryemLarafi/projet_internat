const express = require('express');
const { check } = require('express-validator');
const absenceController = require('../controllers/absence.controller');

const router = express.Router();

// Validation middleware
const validateAbsenceRequest = [
  check('nom').notEmpty().withMessage('Le nom est requis'),
  check('telephone').notEmpty().withMessage('Le numéro de téléphone est requis'),
  check('chambre').notEmpty().withMessage('Le numéro de chambre est requis'),
  check('typeReclamation')
    .notEmpty().withMessage('Le type de réclamation est requis')
    .isIn(['absence', 'restauration']).withMessage('Type de réclamation invalide'),
  check('dateDebut').notEmpty().withMessage('La date de début est requise'),
  check('dateFin').notEmpty().withMessage('La date de fin est requise'),
  check('motif').notEmpty().withMessage('Le motif est requis'),
  check('repas').custom((value, { req }) => {
    if (req.body.typeReclamation === 'restauration' && (!value || value.length === 0)) {
      throw new Error('Au moins un repas doit être sélectionné pour une réclamation de restauration');
    }
    return true;
  })
];

// Routes
// Create a new absence request
router.post('/', validateAbsenceRequest, absenceController.createAbsence);

// Get all absence requests with optional filtering
router.get('/', absenceController.getAllAbsences);

// Get a single absence request by ID
router.get('/:id', absenceController.getAbsenceById);

// Update absence request status
router.patch('/:id/status', absenceController.updateAbsenceStatus);

// Get all rejected absences (history)
router.get('/history/rejected', absenceController.getAbsenceHistory);

// Restore a rejected absence
router.patch('/:id/restore', absenceController.restoreAbsence);

// Get calendar events (accepted absences)
router.get('/calendar/events', absenceController.getCalendarEvents);

// Update an absence request
router.put('/:id', validateAbsenceRequest, absenceController.updateAbsence);

// Delete an absence request
router.delete('/:id', absenceController.deleteAbsence);

module.exports = router;
