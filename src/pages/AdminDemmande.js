import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


import "./admin.css";

const AdminDemmande = () => {
  const [demandes, setDemandes] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const savedDemandes = JSON.parse(localStorage.getItem("demandes")) || [];
    setDemandes(savedDemandes);
  }, []);

  const handleStatusChange = (demande, newStatus) => {
    // Créer une copie de la demande avec le nouveau statut
    const updatedDemande = { ...demande, status: newStatus };
    
    if (newStatus === "refused") {
      // Récupérer l'historique existant
      const historique = JSON.parse(localStorage.getItem("historique_reclamations")) || [];
      
      // Ajouter la date de rejet
      updatedDemande.dateRejet = new Date().toISOString();
      
      // Ajouter la demande refusée à l'historique
      historique.push(updatedDemande);
      
      // Sauvegarder l'historique mis à jour
      localStorage.setItem("historique_reclamations", JSON.stringify(historique));
      
      // Log pour déboguer
      console.log("Demande à refuser:", demande);
      console.log("Nom de la demande à refuser:", demande.nom);
      console.log("Date de début de la demande à refuser:", demande.dateDebut);
      console.log("Type de réclamation de la demande à refuser:", demande.typeReclamation);
      console.log("Liste des demandes avant filtrage:", demandes);
      
      // Supprimer UNIQUEMENT la demande refusée de la liste principale
      // Utiliser une combinaison de propriétés comme identifiant unique
      const updatedDemandes = demandes.filter(d => 
        !(d.nom === demande.nom && 
          d.dateDebut === demande.dateDebut && 
          d.typeReclamation === demande.typeReclamation)
      );
      
      // Log pour déboguer
      console.log("Liste des demandes après filtrage:", updatedDemandes);
      
      // Mettre à jour l'état local et le localStorage
      setDemandes(updatedDemandes);
      localStorage.setItem("demandes", JSON.stringify(updatedDemandes));
      
      // Afficher la notification
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
      // Pour les demandes acceptées, mettre à jour la demande dans la liste
      // Utiliser une combinaison de propriétés comme identifiant unique
      const updatedDemandes = demandes.map(d => 
        (d.nom === demande.nom && 
         d.dateDebut === demande.dateDebut && 
         d.typeReclamation === demande.typeReclamation) ? updatedDemande : d
      );
      setDemandes(updatedDemandes);
      localStorage.setItem("demandes", JSON.stringify(updatedDemandes));
      
      // Afficher une notification de succès
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
  };

  const filteredDemandes = demandes.filter((demande) => {
    const statusMatch = filterStatus === "all" || demande.status === filterStatus;
    const typeMatch = filterType === "all" || demande.typeReclamation === filterType;
    return statusMatch && typeMatch;
  });

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
      

      {filteredDemandes.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-inbox"></i>
          <p>Aucune demande trouvée</p>
        </div>
      ) : (
        filteredDemandes.map((demande, index) => (
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