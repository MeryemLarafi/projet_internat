const express = require('express');
const mongoose = require('mongoose');
const chambreRoutes = require('./routes/chambreRoutes');

const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/chambresinterDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connecté'))
.catch((err) => console.error(err));

app.use('/api/chambres', chambreRoutes);

app.listen(5000, () => {
    console.log('Serveur démarré sur le port 5000');
});
