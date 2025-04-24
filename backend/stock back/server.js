const express = require('express');
const mongoose = require('mongoose');
const produitRoutes = require('./routes/produitRoutes');
const materielRoutes = require('./routes/materielRoutes');
const cuisineRoutes = require('./routes/cuisineRoutes');
const fournisseurRoutes = require('./routes/fournisseurRoutes');

const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/stockDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connecté'))
.catch((err) => console.error(err));

app.use('/api/produits', produitRoutes);
app.use('/api/materiels', materielRoutes);
app.use('/api/cuisine', cuisineRoutes);
app.use('/api/fournisseurs', fournisseurRoutes);

app.listen(5000, () => {
    console.log('Serveur démarré sur le port 5000');
});
