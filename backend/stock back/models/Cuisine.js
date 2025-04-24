const mongoose = require('mongoose');

const cuisineSchema = new mongoose.Schema({
    nom: String,
    quantite: Number,
    date: Date,
});

module.exports = mongoose.model('Cuisine', cuisineSchema);
