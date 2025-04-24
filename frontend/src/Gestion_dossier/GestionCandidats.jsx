import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const apiURL = "http://localhost:8000/api/candidats";

export default function GestionCandidats() {
  const [candidats, setCandidats] = useState([]);
  const [form, setForm] = useState({
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
    score: 0
  });
  const [mode, setMode] = useState("ajouter");
  const [selectedId, setSelectedId] = useState(null);
  const [view, setView] = useState("tableau");
  const [genreView, setGenreView] = useState(null);

  useEffect(() => {
    fetchCandidats();
  }, []);

  const fetchCandidats = async () => {
    try {
      const res = await axios.get(apiURL);
      setCandidats(res.data);
    } catch (err) {
      console.error("Erreur lors du chargement des candidats :", err);
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newForm = {
      ...form,
      [name]: type === "checkbox" ? checked : value,
    };
    newForm.score = calculerScore(newForm);
    setForm(newForm);
  };

  const handleModifier = (candidat) => {
    setForm({ ...candidat });
    setMode("modifier");
    setSelectedId(candidat._id);
    setView("formulaire");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === "ajouter") {
        await axios.post(apiURL, form);
      } else if (mode === "modifier" && selectedId) {
        await axios.put(`${apiURL}/${selectedId}`, form);
      } else {
        throw new Error("Mode ou ID invalide");
      }

      fetchCandidats();
      resetForm();
    } catch (err) {
      console.error("Erreur lors de la soumission :", err);
    }
  };

  const handleSupprimer = async (id) => {
    if (window.confirm("Supprimer ce candidat ?")) {
      try {
        await axios.delete(`${apiURL}/${id}`);
        fetchCandidats();
      } catch (err) {
        console.error("Erreur lors de la suppression :", err);
      }
    }
  };

  const resetForm = () => {
    setForm({
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
      score: 0
    });
    setMode("ajouter");
    setSelectedId(null);
    setView("tableau");
  };

  return (
    <div className="container mt-5">
      <div className="mb-4 d-flex gap-2">
        <button className="btn btn-dark" onClick={() => { setView("formulaire"); setGenreView(null); }}>Ajouter un candidat</button>
        <button className="btn btn-primary" onClick={() => { setView("tableau"); setGenreView("garcon"); }}>Voir tableaux garçons</button>
        <button className="btn btn-danger" onClick={() => { setView("tableau"); setGenreView("fille"); }}>Voir tableaux filles</button>
      </div>

      {view === "formulaire" && (
        <form onSubmit={handleSubmit} className="border p-4 rounded bg-white">
          <h4 className="mb-4">Formulaire d'ajout de candidat</h4>
          <div className="mb-3">
            <label>Nom</label>
            <input name="nom" className="form-control" value={form.nom} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label>Prénom</label>
            <input name="prenom" className="form-control" value={form.prenom} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label>Genre</label>
            <select name="genre" className="form-select" value={form.genre} onChange={handleChange} required>
              <option value="">Sélectionner le genre</option>
              <option value="garcon">Garçon</option>
              <option value="fille">Fille</option>
            </select>
          </div>
          <div className="form-check mb-2">
            <input type="checkbox" name="loinDe5km" checked={form.loinDe5km} onChange={handleChange} className="form-check-input" />
            <label className="form-check-label">Loin de 5 km</label>
          </div>
          <div className="form-check mb-2">
            <input type="checkbox" name="certificat" checked={form.certificat} onChange={handleChange} className="form-check-input" />
            <label className="form-check-label">Certificat de nécessité</label>
          </div>
          <div className="form-check mb-2">
            <input type="checkbox" name="parentDecede" checked={form.parentDecede} onChange={handleChange} className="form-check-input" />
            <label className="form-check-label">Parent décédé</label>
          </div>
          <div className="form-check mb-2">
            <input type="checkbox" name="parentsDivorces" checked={form.parentsDivorces} onChange={handleChange} className="form-check-input" />
            <label className="form-check-label">Parents divorcés</label>
          </div>
          <div className="mb-3">
            <label>Niveau</label>
            <select name="niveau" className="form-select" value={form.niveau} onChange={handleChange} required>
              <option value="">Sélectionner le niveau</option>
              <option value="technicien">Technicien</option>
              <option value="technicienSpecialise">Technicien Spécialisé</option>
              <option value="qualife">Qualife</option>
              <option value="specialise">Spécialisé</option>
            </select>
          </div>
          <div className="form-check mb-2">
            <input type="checkbox" name="besoinSpecify" checked={form.besoinSpecify} onChange={handleChange} className="form-check-input" />
            <label className="form-check-label">Besoin spécifié</label>
          </div>
          <div className="mb-3">
            <label>Nombre de frères</label>
            <input type="number" name="nbFreres" className="form-control" value={form.nbFreres} onChange={handleChange} required />
          </div>
          <button className="btn btn-success">{mode === "ajouter" ? "Ajouter" : "Modifier"}</button>
        </form>
      )}

      {view === "tableau" && genreView && (
        <div className="table-responsive bg-white p-4 rounded">
          <h4 className="mb-4 text-capitalize">{genreView === "garcon" ? "Garçons" : "Filles"} acceptés</h4>
          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Score</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {candidats
                .filter((c) => c.genre === genreView)
                .sort((a, b) => b.score - a.score)
                .slice(0, 20)
                .map((candidat) => (
                  <tr key={candidat._id}>
                    <td>{candidat.nom}</td>
                    <td>{candidat.prenom}</td>
                    <td>{candidat.score}</td>
                    <td>
                      <button className="btn btn-sm btn-primary me-2" onClick={() => handleModifier(candidat)}>Modifier</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleSupprimer(candidat._id)}>Supprimer</button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
