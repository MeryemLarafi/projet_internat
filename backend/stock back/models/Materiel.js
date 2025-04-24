const mongoose = require('mongoose');

const materielSchema = new mongoose.Schema({
    nom: String,
    prix: Number,
    quantite: Number,
    dateEntree: Date,
});

module.exports = mongoose.model('Materiel', materielSchema);
