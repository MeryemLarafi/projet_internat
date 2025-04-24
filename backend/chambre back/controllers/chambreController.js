const Chambre = require('../models/Chambre');

exports.getAllChambres = async (req, res) => {
    const chambres = await Chambre.find();
    res.json(chambres);
};

exports.createChambre = async (req, res) => {
    const chambre = new Chambre(req.body);
    await chambre.save();
    res.status(201).json(chambre);
};

exports.updateChambre = async (req, res) => {
    const chambre = await Chambre.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(chambre);
};

exports.deleteChambre = async (req, res) => {
    await Chambre.findByIdAndDelete(req.params.id);
    res.json({ message: 'Chambre supprimée' });
};
