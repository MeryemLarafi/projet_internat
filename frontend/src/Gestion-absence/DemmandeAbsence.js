import React, { useState, useEffect } from "react";
import "./demmande.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { absenceService } from "../services/api";

const DemmandeAbsence = () => {
  const [formData, setFormData] = useState({
    nom: "",
    telephone: "",
    chambre: "",
    typeReclamation: "",
    dateDebut: "",
    dateFin: "",
    motif: "",
    duree: "",
    repas: [],
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckboxChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      repas: e.target.checked
        ? [...prevData.repas, e.target.value]
        : prevData.repas.filter((repas) => repas !== e.target.value),
    }));
  };

  // Mise à jour automatique de la durée
  useEffect(() => {
    if (formData.dateDebut && formData.dateFin) {
      const dateDebut = new Date(formData.dateDebut);
      const dateFin = new Date(formData.dateFin);

      if (dateDebut <= dateFin) {
        const diffTime = Math.abs(dateFin - dateDebut);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

        setFormData((prevData) => ({
          ...prevData,
          duree: `${diffDays} jour${diffDays > 1 ? "s" : ""}`,
        }));
      } else {
        setFormData((prevData) => ({ ...prevData, duree: "" }));
      }
    } else {
      setFormData((prevData) => ({ ...prevData, duree: "" }));
    }
  }, [formData.dateDebut, formData.dateFin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Envoyer la demande au backend
      await absenceService.createAbsence(formData);
      
      toast.success("🎉 Félicitations ! Votre demande a été soumise avec succès.");

      // Réinitialiser le formulaire
      setFormData({
        nom: "",
        telephone: "",
        chambre: "",
        typeReclamation: "",
        dateDebut: "",
        dateFin: "",
        motif: "",
        duree: "",
        repas: [],
      });
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      toast.error(error.message || "Une erreur est survenue lors de la soumission de votre demande.");
    }
  };

  return (
    <div className="container">
      <div className="header">
        <i className="fas fa-calendar-check logo"></i>
        <h2>Demande d'Absence</h2>
        <p className="subtitle">Remplissez le formulaire ci-dessous pour soumettre votre demande</p>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3 className="section-title">
              <i className="fas fa-user"></i> Informations Personnelles
            </h3>
            <div className="form-gr">
              <label htmlFor="nom">Nom complet</label>
              <div className="input-group">
                <i className="fas fa-user"></i>
                <input type="text" id="nom" name="nom" value={formData.nom} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="telephone">Numéro de téléphone</label>
              <div className="input-gr">
                <i className="fas fa-phone"></i>
                <input
                  type="tel"
                  id="telephone"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  required
                  pattern="[0-9]{10}"
                  placeholder="Ex: 0600000000"
                />
              </div>
            </div>
            <div className="form-grp">
              <label htmlFor="chambre">Numéro de chambre</label>
              <div className="input-group">
                <i className="fas fa-door-closed"></i>
                <input
                  type="text"
                  id="chambre"
                  name="chambre"
                  value={formData.chambre}
                  onChange={handleChange}
                  required
                  placeholder="Ex: A101"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">
              <i className="fas fa-file-alt"></i> Type de Réclamation
            </h3>
            <div className="form-grp">
              <select id="typeReclamation" name="typeReclamation" value={formData.typeReclamation} onChange={handleChange} required>
                <option value="">Sélectionnez le type de réclamation</option>
                <option value="absence">Absence</option>
                <option value="restauration">Restauration</option>
              </select>
            </div>

            {formData.typeReclamation === "absence" && (
              <div className="form-section">
                <div className="form-grp">
                  <label>Durée d'absence</label>
                  <div>{formData.duree || "Sélectionnez les dates"}</div>
                </div>
              </div>
            )}

            {formData.typeReclamation === "restauration" && (
              <div className="form-section">
                <div className="form-grp">
                  <label>Repas concernés</label>
                  <div className="meal-options">
                    <div className="meal-option">
                      <input type="checkbox" id="breakfast" value="breakfast" onChange={handleCheckboxChange} />
                      <label htmlFor="breakfast">Petit-déjeuner</label>
                    </div>
                    <div className="meal-option">
                      <input type="checkbox" id="lunch" value="lunch" onChange={handleCheckboxChange} />
                      <label htmlFor="lunch">Déjeuner</label>
                    </div>
                    <div className="meal-option">
                      <input type="checkbox" id="dinner" value="dinner" onChange={handleCheckboxChange} />
                      <label htmlFor="dinner">Dîner</label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="form-grp">
              <label htmlFor="dateDebut">Date de début</label>
              <input type="date" id="dateDebut" name="dateDebut" value={formData.dateDebut} onChange={handleChange} required />
            </div>
            <div className="form-grp">
              <label htmlFor="dateFin">Date de fin</label>
              <input type="date" id="dateFin" name="dateFin" value={formData.dateFin} onChange={handleChange} required />
            </div>
            <div className="form-grp">
              <label htmlFor="motif">Motif de la réclamation</label>
              <textarea id="motif" name="motif" value={formData.motif} onChange={handleChange} rows="4" required></textarea>
            </div>
          </div>

          <button type="submit" className="submit-btn">
            <i className="fas fa-paper-plane"></i> Soumettre la demande
          </button>
        </form>
      </div>
    </div>
  );
};

export default DemmandeAbsence;
