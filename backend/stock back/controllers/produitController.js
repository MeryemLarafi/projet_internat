const Produit = require('../models/Produit');

exports.getAllProduits = async (req, res) => {
    const produits = await Produit.find();
    res.json(produits);
};

exports.createProduit = async (req, res) => {
    const produit = new Produit(req.body);
    await produit.save();
    res.status(201).json(produit);
};

exports.deleteProduit = async (req, res) => {
    await Produit.findByIdAndDelete(req.params.id);
    res.json({ message: 'Produit supprimé' });
};

exports.updateProduit = async (req, res) => {
    const produit = await Produit.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(produit);
};
