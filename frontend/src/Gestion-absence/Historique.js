import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { absenceService } from "../services/api";
import "./historique.css";

const Historique = () => {
  const [historique, setHistorique] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const navigate = useNavigate();

  // Charger l'historique des demandes refusées
  const loadHistorique = async () => {
    try {
      setLoading(true);
      const response = await absenceService.getAbsenceHistory();
      setHistorique(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors du chargement de l'historique:", error);
      setNotification({
        show: true,
        message: "Erreur lors du chargement de l'historique",
        type: "error"
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistorique();
  }, []);

  const restaurerDemande = async (id) => {
    try {
      await absenceService.restoreAbsence(id);
      
      // Recharger l'historique pour avoir la liste à jour
      await loadHistorique();
      
      setNotification({
        show: true,
        message: "La demande a été restaurée avec succès",
        type: "success"
      });
      
      // Masquer la notification après 3 secondes
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
    } catch (error) {
      console.error("Erreur lors de la restauration de la demande:", error);
      setNotification({
        show: true,
        message: "Erreur lors de la restauration de la demande",
        type: "error"
      });
    }
  };

  return (
    <div className="admin-container">
      <h2>Historique des Demandes</h2>
      <button className="back-btn" onClick={() => navigate("/admin-demmande")}>
        <i className="fas fa-arrow-left"></i> Retour
      </button>

      {notification.show && (
        <div className={`notification ${notification.type}`}>
          <i className={`fas ${
            notification.type === "success" ? "fa-check-circle" : "fa-exclamation-circle"
          }`}></i>
          {notification.message}
        </div>
      )}

      {loading ? (
        <div className="loading">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Chargement de l'historique...</p>
        </div>
      ) : historique.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-inbox"></i>
          <p>Aucune demande rejetée</p>
        </div>
      ) : (
        historique.map((demande) => (
          <div className="demande-carde" key={demande._id}>
            <div className="demande-header">
              <h3>{demande.nom}</h3>
              <span className="status-badge status-rejected">Refusée</span>
            </div>
            <p><strong>Type:</strong> {demande.typeReclamation}</p>
            <p><strong>Motif:</strong> {demande.motif}</p>
            <p><strong>Date de rejet:</strong> {new Date(demande.dateRejet).toLocaleDateString("fr-FR")}</p>
            <button className="restore-btn" onClick={() => restaurerDemande(demande._id)}>
              <i className="fas fa-undo"></i> Restaurer
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Historique;
