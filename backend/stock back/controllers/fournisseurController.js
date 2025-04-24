const Fournisseur = require('../models/Fournisseur');

exports.getAllFournisseurs = async (req, res) => {
    const fournisseurs = await Fournisseur.find();
    res.json(fournisseurs);
};

exports.createFournisseur = async (req, res) => {
    const fournisseur = new Fournisseur(req.body);
    await fournisseur.save();
    res.status(201).json(fournisseur);
};

exports.deleteFournisseur = async (req, res) => {
    await Fournisseur.findByIdAndDelete(req.params.id);
    res.json({ message: 'Fournisseur supprimé' });
};

exports.updateFournisseur = async (req, res) => {
    const fournisseur = await Fournisseur.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(fournisseur);
};
