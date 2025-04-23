# API Backend pour la Gestion des Absences

Ce backend Express.js fournit une API RESTful pour gérer les demandes d'absence dans le système de gestion d'internat.

## Installation

1. Cloner le dépôt
2. Installer les dépendances :
   ```
   cd backend
   npm install
   ```
3. Configurer les variables d'environnement :
   - Créer un fichier `.env` à la racine du dossier backend
   - Ajouter les variables suivantes :
     ```
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/gestion-internat
     NODE_ENV=development
     ```

## Démarrage

Pour démarrer le serveur en mode développement :
```
npm run dev
```

Pour démarrer le serveur en mode production :
```
npm start
```

## Structure du Projet

```
backend/
├── src/
│   ├── config/        # Configuration (base de données, etc.)
│   ├── controllers/   # Contrôleurs pour gérer la logique métier
│   ├── middleware/    # Middleware (validation, gestion d'erreurs, etc.)
│   ├── models/        # Modèles de données Mongoose
│   └── routes/        # Routes API
├── .env               # Variables d'environnement
├── package.json       # Dépendances et scripts
├── README.md          # Documentation
└── server.js          # Point d'entrée de l'application
```

## API Endpoints

### Demandes d'Absence

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/absences` | Récupérer toutes les demandes d'absence (filtrage optionnel) |
| GET | `/api/absences/:id` | Récupérer une demande d'absence par ID |
| POST | `/api/absences` | Créer une nouvelle demande d'absence |
| PUT | `/api/absences/:id` | Mettre à jour une demande d'absence |
| DELETE | `/api/absences/:id` | Supprimer une demande d'absence |
| PATCH | `/api/absences/:id/status` | Mettre à jour le statut d'une demande (accepter/refuser) |

### Historique

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/absences/history/rejected` | Récupérer l'historique des demandes refusées |
| PATCH | `/api/absences/:id/restore` | Restaurer une demande refusée |

### Calendrier

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/absences/calendar/events` | Récupérer les événements du calendrier (absences acceptées) |

## Modèle de Données

### Absence

```javascript
{
  nom: String,              // Nom de l'étudiant
  telephone: String,        // Numéro de téléphone
  chambre: String,          // Numéro de chambre
  typeReclamation: String,  // Type de réclamation (absence, restauration)
  dateDebut: Date,          // Date de début
  dateFin: Date,            // Date de fin
  duree: String,            // Durée (pour les absences)
  repas: [String],          // Repas concernés (pour les restaurations)
  motif: String,            // Motif de la demande
  status: String,           // Statut (pending, accepted, refused)
  dateRejet: Date,          // Date de rejet (si refusée)
  createdAt: Date,          // Date de création
  updatedAt: Date           // Date de mise à jour
}
```

## Intégration avec le Frontend

Pour intégrer cette API avec le frontend React existant, vous devrez :

1. Modifier les composants frontend pour utiliser les endpoints API au lieu du localStorage
2. Ajouter un service API pour gérer les requêtes HTTP
3. Gérer les réponses et les erreurs de l'API

Exemple d'intégration avec Axios :

```javascript
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Créer une instance axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Exemple de service pour les demandes d'absence
export const absenceService = {
  // Récupérer toutes les demandes
  getAllAbsences: async (filters = {}) => {
    const response = await api.get('/absences', { params: filters });
    return response.data;
  },
  
  // Créer une nouvelle demande
  createAbsence: async (absenceData) => {
    const response = await api.post('/absences', absenceData);
    return response.data;
  },
  
  // Mettre à jour le statut d'une demande
  updateStatus: async (id, status) => {
    const response = await api.patch(`/absences/${id}/status`, { status });
    return response.data;
  },
  
  // Récupérer l'historique
  getHistory: async () => {
    const response = await api.get('/absences/history/rejected');
    return response.data;
  },
  
  // Récupérer les événements du calendrier
  getCalendarEvents: async (dateRange) => {
    const response = await api.get('/absences/calendar/events', { params: dateRange });
    return response.data;
  }
};
