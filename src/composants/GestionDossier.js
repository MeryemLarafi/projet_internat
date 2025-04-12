import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/GestionDossier.css';

const API_URL = 'http://localhost:8000/api/candidats'; // Remplacez par l'URL de votre API.

const GestionDossier = () => {
  const [candidats, setCandidats] = useState([]);
  const [page, setPage] = useState('formulaire');
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    genre: '',
    loinDe5km: false,
    certificat: false,
    parentDecede: false,
    parentsDivorces: false,
    niveau: '',
    besoinSpecify: false,
    nbFreres: 0,
  });

  // Charger les candidats au montage
  useEffect(() => {
    chargerCandidats();
  }, []);

  const chargerCandidats = async () => {
    try {
      const response = await axios.get(API_URL);
      setCandidats(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des candidats :', error);
    }
  };

  const calculerScore = (data) => {
    let score = 0;
    if (data.loinDe5km) score += 20;
    if (data.certificat) score += 10;
    if (data.parentDecede) score += 10;
    if (data.parentsDivorces) score += 10;

    switch (data.niveau) {
      case 'technicien':
        score += 10;
        break;
      case 'technicienSpecialise':
        score += 5;
        break;
      case 'qualife':
        score += 15;
        break;
      case 'specialise':
        score += 20;
        break;
      default:
        break;
    }

    if (data.besoinSpecify) score += 20;
    score += parseInt(data.nbFreres, 10) || 0;

    return score;
  };

  const ajouterCandidat = async (e) => {
    e.preventDefault();
    const score = calculerScore(formData);

    try {
      const response = await axios.post(API_URL, {
        ...formData,
        score,
      });
      setCandidats([...candidats, response.data]);
      setFormData({
        nom: '',
        prenom: '',
        genre: '',
        loinDe5km: false,
        certificat: false,
        parentDecede: false,
        parentsDivorces: false,
        niveau: '',
        besoinSpecify: false,
        nbFreres: 0,
      });
      setPage('tableaux');
    } catch (error) {
      console.error('Erreur lors de l’ajout du candidat :', error);
    }
  };

  const supprimerCandidat = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setCandidats(candidats.filter((c) => c.id !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression du candidat :', error);
    }
  };

  const modifierCandidat = async (id, nouveauScore) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, { score: nouveauScore });
      setCandidats(candidats.map((c) => (c.id === id ? response.data : c)));
    } catch (error) {
      console.error('Erreur lors de la modification du candidat :', error);
    }
  };

  const trierParScore = (liste) =>
    liste.sort((a, b) => b.score - a.score);

  const garcons = trierParScore(candidats.filter((c) => c.genre === 'garçon'));
  const filles = trierParScore(candidats.filter((c) => c.genre === 'fille'));

  const tableauGarcons = garcons.slice(0, 12);
  const attenteGarcons = garcons.slice(12, 37);
  const tableauFilles = filles.slice(0, 12);
  const attenteFilles = filles.slice(12, 37);

  return (
    <div>
      <nav>
        <button onClick={() => setPage('formulaire')}>Ajouter un candidat</button>
        <button onClick={() => setPage('tableaux')}>Voir les tableaux</button>
      </nav>

      {page === 'formulaire' ? (
        <form onSubmit={ajouterCandidat}>
  <h2 style={{ color: '#000000' }}>Formulaire d'ajout de candidat</h2>

  <input
    type="text"
    placeholder="Nom"
    value={formData.nom}
    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
    required
  />
  <input
    type="text"
    placeholder="Prénom"
    value={formData.prenom}
    onChange={(e) =>
      setFormData({ ...formData, prenom: e.target.value })
    }
    required
  />
  <select
    value={formData.genre}
    onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
    required
  >
    <option value="">Sélectionner le genre</option>
    <option value="garçon">Garçon</option>
    <option value="fille">Fille</option>
  </select>

  <label>
    Loin de 5 km :
    <input
      type="checkbox"
      checked={formData.loinDe5km}
      onChange={(e) =>
        setFormData({ ...formData, loinDe5km: e.target.checked })
      }
    />
  </label>

  <label>
    Certificat de nécessité :
    <input
      type="checkbox"
      checked={formData.certificat}
      onChange={(e) =>
        setFormData({ ...formData, certificat: e.target.checked })
      }
    />
  </label>

  <label>
    Parent décédé :
    <input
      type="checkbox"
      checked={formData.parentDecede}
      onChange={(e) =>
        setFormData({ ...formData, parentDecede: e.target.checked })
      }
    />
  </label>

  <label>
    Parents divorcés :
    <input
      type="checkbox"
      checked={formData.parentsDivorces}
      onChange={(e) =>
        setFormData({ ...formData, parentsDivorces: e.target.checked })
      }
    />
  </label>

  <select
    value={formData.niveau}
    onChange={(e) => setFormData({ ...formData, niveau: e.target.value })}
    required
  >
    <option value="">Sélectionner le niveau</option>
    <option value="technicien">Technicien</option>
    <option value="technicienSpecialise">Technicien Spécialisé</option>
    <option value="qualife">Qualife</option>
    <option value="specialise">Spécialisé</option>
  </select>

  <label>
    Besoin spécifié :
    <input
      type="checkbox"
      checked={formData.besoinSpecify}
      onChange={(e) =>
        setFormData({ ...formData, besoinSpecify: e.target.checked })
      }
    />
  </label>

  <input
    type="number"
    placeholder="Nombre de frères"
    value={formData.nbFreres}
    onChange={(e) => setFormData({ ...formData, nbFreres: e.target.value })}
    required
  />

  <button type="submit">Ajouter</button>
</form>


      ) : (
        <div>
          <h2>Tableau des garçons</h2>
          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Score</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tableauGarcons.map((c) => (
                <tr key={c.id}>
                  <td>{c.nom}</td>
                  <td>{c.prenom}</td>
                  <td>{c.score}</td>
                  <td>
                    <button onClick={() => supprimerCandidat(c.id)}>Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Faites de même pour les filles */}
        </div>
      )}
    </div>
  );
};

export default GestionDossier;
