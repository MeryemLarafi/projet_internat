const mongoose = require('mongoose');

const AbsenceSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    trim: true
  },
  telephone: {
    type: String,
    required: true,
    trim: true
  },
  chambre: {
    type: String,
    required: true,
    trim: true
  },
  typeReclamation: {
    type: String,
    required: true,
    enum: ['absence', 'restauration']
  },
  dateDebut: {
    type: Date,
    required: true
  },
  dateFin: {
    type: Date,
    required: true
  },
  duree: {
    type: String,
    required: function() {
      return this.typeReclamation === 'absence';
    }
  },
  repas: {
    type: [String],
    required: function() {
      return this.typeReclamation === 'restauration';
    },
    validate: {
      validator: function(v) {
        if (this.typeReclamation === 'restauration') {
          return v && v.length > 0;
        }
        return true;
      },
      message: 'Au moins un repas doit être sélectionné pour une réclamation de restauration'
    }
  },
  motif: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'accepted', 'refused'],
    default: 'pending'
  },
  dateRejet: {
    type: Date,
    required: function() {
      return this.status === 'refused';
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Absence', AbsenceSchema);
