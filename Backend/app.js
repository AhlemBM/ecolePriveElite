const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const coursRoutes = require('./routes/courseRoutes');

const app = express();

// ✅ 1. Configuration de CORS avant les routes
app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true
}));

// ✅ 2. Middleware pour gérer les requêtes JSON et URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ 3. Middleware pour les en-têtes CORS (déjà géré par `cors()`, mais pour s'assurer)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    next();
});

// ✅ 4. Vérification des requêtes reçues
app.use((req, res, next) => {
    console.log(`➡️ ${req.method} ${req.url}`);
    console.log('Body:', req.body);
    next();
});

// ✅ 5. Utilisation des routes
app.use('/users', userRoutes);
app.use('/courses', coursRoutes);


// ✅ 6. Connexion à MongoDB
mongoose.connect('mongodb+srv://ahlem18896:Nmlsn16NlgB2LanO@cluster0.maid4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => console.error("❌ Error connecting to MongoDB", err));

// ✅ 7. Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
