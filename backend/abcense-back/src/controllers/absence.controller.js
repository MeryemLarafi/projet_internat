const Absence = require('../models/absence.model');
const { validationResult } = require('express-validator');

// Create a new absence request
exports.createAbsence = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Create new absence request
    const absence = new Absence(req.body);
    const savedAbsence = await absence.save();
    
    res.status(201).json({
      success: true,
      message: 'Demande d\'absence créée avec succès',
      data: savedAbsence
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la demande d\'absence',
      error: error.message
    });
  }
};

// Get all absence requests
exports.getAllAbsences = async (req, res) => {
  try {
    // Get query parameters for filtering
    const { status, typeReclamation } = req.query;
    
    // Build filter object
    const filter = {};
    if (status && status !== 'all') filter.status = status;
    if (typeReclamation && typeReclamation !== 'all') filter.typeReclamation = typeReclamation;
    
    const absences = await Absence.find(filter).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: absences.length,
      data: absences
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des demandes d\'absence',
      error: error.message
    });
  }
};

// Get a single absence request by ID
exports.getAbsenceById = async (req, res) => {
  try {
    const absence = await Absence.findById(req.params.id);
    
    if (!absence) {
      return res.status(404).json({
        success: false,
        message: 'Demande d\'absence non trouvée'
      });
    }
    
    res.status(200).json({
      success: true,
      data: absence
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la demande d\'absence',
      error: error.message
    });
  }
};

// Update absence request status
exports.updateAbsenceStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'accepted', 'refused'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Statut invalide'
      });
    }
    
    const updateData = { status };
    
    // If status is refused, add rejection date
    if (status === 'refused') {
      updateData.dateRejet = new Date();
    }
    
    const absence = await Absence.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!absence) {
      return res.status(404).json({
        success: false,
        message: 'Demande d\'absence non trouvée'
      });
    }
    
    res.status(200).json({
      success: true,
      message: `Demande d'absence ${status === 'accepted' ? 'acceptée' : 'refusée'} avec succès`,
      data: absence
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du statut de la demande d\'absence',
      error: error.message
    });
  }
};

// Get all rejected absences (history)
exports.getAbsenceHistory = async (req, res) => {
  try {
    const rejectedAbsences = await Absence.find({ status: 'refused' }).sort({ dateRejet: -1 });
    
    res.status(200).json({
      success: true,
      count: rejectedAbsences.length,
      data: rejectedAbsences
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'historique des demandes d\'absence',
      error: error.message
    });
  }
};

// Restore a rejected absence
exports.restoreAbsence = async (req, res) => {
  try {
    const absence = await Absence.findByIdAndUpdate(
      req.params.id,
      { status: 'pending', dateRejet: null },
      { new: true, runValidators: true }
    );
    
    if (!absence) {
      return res.status(404).json({
        success: false,
        message: 'Demande d\'absence non trouvée'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Demande d\'absence restaurée avec succès',
      data: absence
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la restauration de la demande d\'absence',
      error: error.message
    });
  }
};

// Get calendar events (accepted absences)
exports.getCalendarEvents = async (req, res) => {
  try {
    // Get query parameters for filtering by date range
    const { start, end, view } = req.query;
    
    // Build filter object
    const filter = { status: 'accepted' };
    
    // If date range is provided, filter by it
    if (start && end) {
      filter.$or = [
        // Events that start within the range
        { dateDebut: { $gte: new Date(start), $lte: new Date(end) } },
        // Events that end within the range
        { dateFin: { $gte: new Date(start), $lte: new Date(end) } },
        // Events that span the entire range
        { dateDebut: { $lte: new Date(start) }, dateFin: { $gte: new Date(end) } }
      ];
    }
    
    const absences = await Absence.find(filter).sort({ dateDebut: 1 });
    
    // Format events for calendar
    const events = absences.map(absence => ({
      id: absence._id,
      title: `${absence.nom} - ${absence.typeReclamation === 'absence' ? 'Absence' : 'Restauration'}`,
      start: absence.dateDebut,
      end: absence.dateFin,
      allDay: true,
      resource: absence
    }));
    
    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des événements du calendrier',
      error: error.message
    });
  }
};

// Update an absence request
exports.updateAbsence = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const absence = await Absence.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!absence) {
      return res.status(404).json({
        success: false,
        message: 'Demande d\'absence non trouvée'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Demande d\'absence mise à jour avec succès',
      data: absence
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la demande d\'absence',
      error: error.message
    });
  }
};

// Delete an absence request
exports.deleteAbsence = async (req, res) => {
  try {
    const absence = await Absence.findByIdAndDelete(req.params.id);
    
    if (!absence) {
      return res.status(404).json({
        success: false,
        message: 'Demande d\'absence non trouvée'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Demande d\'absence supprimée avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la demande d\'absence',
      error: error.message
    });
  }
};
