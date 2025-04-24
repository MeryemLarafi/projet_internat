const mongoose = require('mongoose');

const fournisseurSchema = new mongoose.Schema({
    nom: String,
});

module.exports = mongoose.model('Fournisseur', fournisseurSchema);
