const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const candidatsRoutes = require('./routes/candidats');

const app = express();
const PORT = 8000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/candidats', candidatsRoutes);

// Connexion MongoDB
mongoose.connect('mongodb://localhost:27017/candidatsDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ Connecté à MongoDB');
  app.listen(PORT, () => console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`));
}).catch((err) => {
  console.error('Erreur de connexion MongoDB:', err);
});
