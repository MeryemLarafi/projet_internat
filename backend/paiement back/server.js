const express = require('express');
const mongoose = require('mongoose');
const paiementRoutes = require('./routes/paiementRoutes');

const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/paiementsDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connecté'))
.catch((err) => console.error(err));

app.use('/api/paiements', paiementRoutes);

app.listen(5000, () => {
    console.log('Serveur démarré sur le port 5000');
});
