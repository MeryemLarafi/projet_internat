const mongoose = require('mongoose');

const chambreSchema = new mongoose.Schema({
    nomStagiaire: String,
    specialite: String,
    genre: {
        type: String,
        enum: ['fille', 'garçon']
    },
    chambre: String
});

module.exports = mongoose.model('Chambre', chambreSchema);
