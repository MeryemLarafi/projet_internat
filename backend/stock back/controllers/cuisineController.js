const Cuisine = require('../models/Cuisine');

exports.getAllCuisine = async (req, res) => {
    const cuisines = await Cuisine.find();
    res.json(cuisines);
};

exports.createCuisine = async (req, res) => {
    const cuisine = new Cuisine(req.body);
    await cuisine.save();
    res.status(201).json(cuisine);
};

exports.deleteCuisine = async (req, res) => {
    await Cuisine.findByIdAndDelete(req.params.id);
    res.json({ message: 'Entrée cuisine supprimée' });
};

exports.updateCuisine = async (req, res) => {
    const cuisine = await Cuisine.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(cuisine);
};
