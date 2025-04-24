const mongoose = require('mongoose');

const paiementSchema = new mongoose.Schema({
    cin: String,
    prenom: String,
    nom: String,
    filiere: String,
    moisPaiement: [String] 
});

module.exports = mongoose.model('Paiement', paiementSchema);
