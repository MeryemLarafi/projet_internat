const Materiel = require('../models/Materiel');

exports.getAllMateriels = async (req, res) => {
    const materiels = await Materiel.find();
    res.json(materiels);
};

exports.createMateriel = async (req, res) => {
    const materiel = new Materiel(req.body);
    await materiel.save();
    res.status(201).json(materiel);
};

exports.deleteMateriel = async (req, res) => {
    await Materiel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Matériel supprimé' });
};

exports.updateMateriel = async (req, res) => {
    const materiel = await Materiel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(materiel);
};
