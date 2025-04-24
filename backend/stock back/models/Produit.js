const mongoose = require('mongoose');

const produitSchema = new mongoose.Schema({
    nom: String,
    prix: Number,
    quantite: Number,
    dateEntree: Date,
    dateExpiration: Date,
});

module.exports = mongoose.model('Produit', produitSchema);
