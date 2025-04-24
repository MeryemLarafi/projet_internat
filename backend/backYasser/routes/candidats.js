const express = require('express');
const router = express.Router();
const Candidat = require('../models/Candidat');

// GET all candidats
router.get('/', async (req, res) => {
  const candidats = await Candidat.find();
  res.json(candidats);
});

// POST create candidat
router.post('/', async (req, res) => {
  try {
    const newCandidat = new Candidat(req.body);
    await newCandidat.save();
    res.status(201).json(newCandidat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update candidat
router.put('/:id', async (req, res) => {
    console.log('PUT called with ID:', req.params.id);
    console.log('Body:', req.body);
  try {
    const updated = await Candidat.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE candidat
router.delete('/:id', async (req, res) => {
    console.log('DELETE called with ID:', req.params.id);
  try {
    await Candidat.findByIdAndDelete(req.params.id);
    res.json({ message: 'Candidat supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
