const Paiement = require('../models/Paiement');

exports.getAllPaiements = async (req, res) => {
    const paiements = await Paiement.find();
    res.json(paiements);
};

exports.createPaiement = async (req, res) => {
    const paiement = new Paiement(req.body);
    await paiement.save();
    res.status(201).json(paiement);
};

exports.updatePaiement = async (req, res) => {
    const paiement = await Paiement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(paiement);
};

exports.deletePaiement = async (req, res) => {
    await Paiement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Paiement supprimé' });
};
