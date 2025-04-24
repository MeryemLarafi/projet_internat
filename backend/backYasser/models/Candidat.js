const mongoose = require('mongoose');

const candidatSchema = new mongoose.Schema({
  nom: String,
  prenom: String,
  genre: String,
  loinDe5km: Boolean,
  certificat: Boolean,
  parentDecede: Boolean,
  parentsDivorces: Boolean,
  niveau: String,
  besoinSpecify: Boolean,
  nbFreres: Number,
  score: Number,
}, { timestamps: true });

module.exports = mongoose.model('Candidat', candidatSchema);
