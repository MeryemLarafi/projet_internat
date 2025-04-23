import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { absenceService } from "../services/api";
import "./admin.css";

const AdminDemmande = () => {
  const [demandes, setDemandes] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Charger les demandes depuis l'API
  const loadDemandes = useCallback(async () => {
    try {
      setLoading(true);
      const filters = {};
      if (filterStatus !== "all") filters.status = filterStatus;
      if (filterType !== "all") filters.typeReclamation = filterType;
      
      // Toujours exclure les demandes refusées de cette vue
      filters.status = filters.status || "!refused";
      
      const response = await absenceService.getAllAbsences(filters);
      setDemandes(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors du chargement des demandes:", error);
      setNotification({
        show: true,
        message: "Erreur lors du chargement des demandes",
        type: "error"
      });
      setLoading(false);
    }
  }, [filterStatus, filterType]);

  useEffect(() => {
    loadDemandes();
  }, [filterStatus, filterType, loadDemandes]);

  const handleStatusChange = async (demande, newStatus) => {
    try {
      // Mettre à jour le statut via l'API
      await absenceService.updateAbsenceStatus(demande._id, newStatus);
      
      // Recharger les demandes pour avoir la liste à jour
      await loadDemandes();
      
      // Afficher la notification appropriée
      if (newStatus === "refused") {
        setNotification({
          show: true,
          message: "La demande a été refusée. Vous pouvez la consulter dans l'historique.",
          type: "info"
        });
        
        // Masquer la notification après 5 secondes
        setTimeout(() => {
          setNotification({ show: false, message: "", type: "" });
        }, 5000);
      } else if (newStatus === "accepted") {
        setNotification({
          show: true,
          message: "La demande a été acceptée avec succès",
          type: "success"
        });
        
        // Masquer la notification après 3 secondes
        setTimeout(() => {
          setNotification({ show: false, message: "", type: "" });
        }, 3000);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      setNotification({
        show: true,
        message: "Erreur lors de la mise à jour du statut",
        type: "error"
      });
    }
  };


  return (
    <div className="admin-container">
      <h2>Gestion des Demandes</h2>
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          <i className={`fas ${
            notification.type === "info" ? "fa-info-circle" :
            notification.type === "success" ? "fa-check-circle" :
            "fa-exclamation-circle"
          }`}></i>
          {notification.message}
          {notification.type === "info" && (
            <button 
              className="notification-link"
              onClick={() => navigate("/historique")}
            >
              Voir l'historique
            </button>
          )}
        </div>
      )}
      <div className="filters">
        <div className="custom-select">
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">Filtrer par status</option>
            <option value="pending">En attente</option>
            <option value="accepted">Acceptée</option>
          </select>
          <i className={`fas ${
            filterStatus === "all" ? "fa-filter" :
            filterStatus === "pending" ? "fa-clock" :
            "fa-check-circle"
          }`}></i>
        </div>

        <div className="custom-select">
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">Filtrer par types</option>
            <option value="absence">Absence en hebergement</option>
            <option value="restauration">Absence en Restauration</option>
          </select>
          <i className={`fas ${
            filterType === "all" ? "fa-filter" :
            filterType === "absence" ? "fa-door-closed" :
            "fa-utensils"
          }`}></i>
        </div>

        <button className="historique-btn" onClick={() => navigate("/historique")}>
          <i className="fas fa-history"></i> Historique
        </button>
      </div>
      

      {loading ? (
        <div className="loading">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Chargement des demandes...</p>
        </div>
      ) : demandes.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-inbox"></i>
          <p>Aucune demande trouvée</p>
        </div>
      ) : (
        demandes.map((demande, index) => (
          <div className="demande-card" key={index}>
            <div className="demande-header">
              <div className="demande-info">
                <h3 className="demmande-nom"> {demande.nom}</h3><br></br>
                <div className="contact-info">
                  <span><i className="fas fa-phone" ></i>:     {demande.telephone}</span><br></br>
                  <span><i className="fas fa-door-closed"></i> Chambre :   {demande.chambre}</span>
                </div>
              </div>
              <span className={`status-badge status-${demande.status}`}>
                {demande.status === "accepted" ? "Acceptée" : demande.status === "rejected" ? "Refusée" : "En attente"}
              </span>
            </div>
            <div className="demande-details">
              <p><strong>Type:</strong> {demande.typeReclamation === "absence" ? "Absence" : "Restauration"}</p>
              <p><strong> Periode Du:</strong> {new Date(demande.dateDebut).toLocaleDateString("fr-FR")}</p>
              <p><strong>à:</strong> {new Date(demande.dateFin).toLocaleDateString("fr-FR")}</p>
              {demande.typeReclamation === "restauration" ? (
                <p><strong>Repas concernés:</strong> {
  Array.isArray(demande.repas)
    ? demande.repas.join(", ")
    : (demande.repas ? Object.values(demande.repas).join(", ") : "Aucun repas")
}</p>) : (
  <p><strong>Durée:</strong> {demande.duree}</p>
)}
               
              <p><strong>Motif:</strong> {demande.motif}</p>
            </div>
            {demande.status === "pending" && (
              <div className="demande-actions">
                <button className="action-btn accept" onClick={() => handleStatusChange(demande, "accepted")}>
                  <i className="fas fa-check"></i> Accepter
                </button>
                <button className="action-btn reject" onClick={() => handleStatusChange(demande, "refused")}>
                  <i className="fas fa-times"></i> Refuser
                </button>
                
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default AdminDemmande;
