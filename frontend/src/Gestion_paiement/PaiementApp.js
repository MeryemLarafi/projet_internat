import React, { useState, useEffect } from "react";
import {  FaTrash, FaPlus, FaEdit, FaFilePdf } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./PaiementApp.css";

const moisDisponibles = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

// PageList Component
const PageList = ({
  stagiaires,
  searchTerm,
  setSearchTerm,
  handleDeleteAll,
  handleAjoutPaiement,
  handleEdit,
  handleDelete,
}) => {
  const [isExporting, setIsExporting] = React.useState(false);

  const exportToPDF = () => {
    const filteredStagiaires = stagiaires.filter(
      (stagiaire) =>
        stagiaire.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stagiaire.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stagiaire.cin.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!filteredStagiaires.length) {
      alert("Aucun stagiaire à exporter !");
      return;
    }

    setIsExporting(true);
    const doc = new jsPDF();

    autoTable(doc, {
      head: [["CIN", "Nom", "Prénom", "Filière", "Mois Payés", "Montant"]],
      body: filteredStagiaires.map((stagiaire) => [
        stagiaire.cin,
        stagiaire.nom,
        stagiaire.prenom,
        stagiaire.filiere,
        stagiaire.moisPaiement.join(", "),
        `${stagiaire.montant} DH`,
      ]),
      startY: 30,
      styles: {
        fontSize: 10,
        cellPadding: 3,
        overflow: "linebreak",
      },
      headStyles: {
        fillColor: [52, 73, 94],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      margin: { top: 30 },
      theme: "striped",
      didDrawPage: () => {
        doc.setFontSize(18);
        doc.text("Liste des Stagiaires", 14, 20);
        doc.setFontSize(10);
        doc.text(`Généré le: ${new Date().toLocaleString()}`, 14, 25);
      },
    });

    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(
        `Page ${i} de ${pageCount}`,
        doc.internal.pageSize.width - 30,
        doc.internal.pageSize.height - 10
      );
    }

    doc.save("liste_stagiaires.pdf");
    setIsExporting(false);
    alert("PDF exporté avec succès !");
  };

  return (
    <div className="table-container">
      <h2 className="table-title">Liste des Stagiaires</h2>
      <div className="table-actions">

      <div className="search-bar">
        <input
          type="text"
          placeholder="    Rechercher un stagiaire..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
          aria-label="Rechercher des stagiaires par nom, prénom ou CIN"
        />
      </div>

        <button onClick={handleDeleteAll} className="delete-all-button">
          <FaTrash /> Supprimer Tout
        </button>
        <button
          onClick={exportToPDF}
          className="export-pdf-button"
          disabled={isExporting}
        >
          <FaFilePdf /> {isExporting ? "Exportation..." : "Exporter en PDF"}
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>CIN</th>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Filière</th>
            <th>Mois Payés</th>
            <th>Montant</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {stagiaires
            .filter(
              (stagiaire) =>
                stagiaire.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                stagiaire.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                stagiaire.cin.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((stagiaire, index) => (
              <tr key={index}>
                <td>{stagiaire.cin}</td>
                <td>{stagiaire.nom}</td>
                <td>{stagiaire.prenom}</td>
                <td>{stagiaire.filiere}</td>
                <td>{stagiaire.moisPaiement.join(", ")}</td>
                <td>{stagiaire.montant} DH</td>
                <td>
                  <button
                    onClick={() => handleAjoutPaiement(stagiaire.cin)}
                    className="ajouter-paiement"
                    aria-label="Ajouter paiement"
                  >
                    <FaPlus />
                  </button>
                  <button
                    onClick={() => handleEdit(stagiaire)}
                    className="modifier"
                    aria-label="Modifier stagiaire"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(stagiaire.cin)}
                    className="supprimer"
                    aria-label="Supprimer stagiaire"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

// PaymentModal Component
const PaymentModal = ({
  paymentAmount,
  setPaymentAmount,
  handleSubmitPayment,
  setPaymentModal,
}) => {
  return (
    <div className="payment-modal">
      <div className="modal-content">
        <h3>Ajouter Paiement</h3>
        <label>Montant du paiement :</label>

        <div className="payment-input">
          <button
            onClick={() => setPaymentAmount((prev) => Math.max(0, prev - 200))}
            className="decrement-button"
            aria-label="Diminuer le montant"
          >
            -
          </button>

          <input type="number" value={paymentAmount} readOnly />

          <button
            onClick={() => setPaymentAmount((prev) => prev + 200)}
            className="increment-button"
            aria-label="Augmenter le montant"
          >
            +
          </button>
        </div>

        <button
          onClick={handleSubmitPayment}
          className="submit-payment"
          aria-label="Confirmer le paiement"
        >
          Ajouter Paiement
        </button>
        <button
          onClick={() => setPaymentModal(false)}
          className="cancel-button"
          aria-label="Annuler"
        >
          Annuler
        </button>
      </div>
    </div>
  );
};

// StagiaireForm Component
const StagiaireForm = ({ onAdd, editingStagiaire, stagiaires }) => {
  const [cin, setCin] = useState(editingStagiaire ? editingStagiaire.cin : "");
  const [nom, setNom] = useState(editingStagiaire ? editingStagiaire.nom : "");
  const [prenom, setPrenom] = useState(
    editingStagiaire ? editingStagiaire.prenom : ""
  );
  const [filiere, setFiliere] = useState(
    editingStagiaire ? editingStagiaire.filiere : ""
  );
  const [moisPaiement, setMoisPaiement] = useState(
    editingStagiaire ? editingStagiaire.moisPaiement : []
  );
  const [montantTotal, setMontantTotal] = useState(
    editingStagiaire ? editingStagiaire.montant : 0
  );
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (editingStagiaire) {
      setCin(editingStagiaire.cin);
      setNom(editingStagiaire.nom);
      setPrenom(editingStagiaire.prenom);
      setFiliere(editingStagiaire.filiere);
      setMoisPaiement(editingStagiaire.moisPaiement || []);
      setMontantTotal(editingStagiaire.montant || 0);
    }
  }, [editingStagiaire]);

  const handleMoisClick = (mois) => {
    if (moisPaiement.includes(mois)) {
      setMoisPaiement(moisPaiement.filter((m) => m !== mois));
      setMontantTotal(montantTotal - 200);
    } else {
      setMoisPaiement([...moisPaiement, mois]);
      setMontantTotal(montantTotal + 200);
    }
  };

  const validateForm = () => {
    if (!cin || !nom || !prenom || !filiere || moisPaiement.length === 0) {
      setError("Veuillez remplir tous les champs obligatoires !");
      return false;
    }

    // Validation du format CIN (6 caractères alphanumériques)
    const cinRegex = /^[A-Za-z0-9]{6}$/;
    if (!cinRegex.test(cin)) {
      setError("Le CIN doit contenir exactement 6 caractères alphanumériques !");
      return false;
    }

    // Vérification du CIN unique
    const isDuplicate = stagiaires.some(
      (stagiaire) =>
        stagiaire.cin.toLowerCase() === cin.toLowerCase() &&
        (!editingStagiaire || stagiaire.cin !== editingStagiaire.cin)
    );

    if (isDuplicate) {
      setError("Ce CIN existe déjà ! Veuillez utiliser un CIN unique.");
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    onAdd({ cin, nom, prenom, filiere, moisPaiement, montant: montantTotal });
    setSuccess(editingStagiaire ? "Stagiaire mis à jour avec succès !" : "Stagiaire ajouté avec succès !");
    
    // Réinitialiser le formulaire seulement si ce n'est pas une édition
    if (!editingStagiaire) {
      setCin("");
      setNom("");
      setPrenom("");
      setFiliere("");
      setMoisPaiement([]);
      setMontantTotal(0);
    }

    // Effacer le message de succès après 3 secondes
    setTimeout(() => {
      setSuccess("");
    }, 3000);
  };

  return (
    <div className="form-container">
      <h2>{editingStagiaire ? "Modifier un Stagiaire" : "Ajouter un Stagiaire"}</h2>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="form-group">
        <label htmlFor="cin">CIN *</label>
        <input
          id="cin"
          type="text"
          placeholder="Entrez le CIN (6 caractères)"
          value={cin}
          onChange={(e) => setCin(e.target.value.toUpperCase())}
          maxLength={6}
          aria-label="CIN du stagiaire"
        />
      </div>

      <div className="form-group">
        <label htmlFor="nom">Nom *</label>
        <input
          id="nom"
          type="text"
          placeholder="Entrez le nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          aria-label="Nom du stagiaire"
        />
      </div>

      <div className="form-group">
        <label htmlFor="prenom">Prénom *</label>
        <input
          id="prenom"
          type="text"
          placeholder="Entrez le prénom"
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)}
          aria-label="Prénom du stagiaire"
        />
      </div>

      <div className="form-group">
        <label htmlFor="filiere">Filière *</label>
        <input
          id="filiere"
          type="text"
          placeholder="Entrez la filière"
          value={filiere}
          onChange={(e) => setFiliere(e.target.value)}
          aria-label="Filière du stagiaire"
        />
      </div>

      <div className="form-group">
        <label>Sélectionnez les mois de paiement *</label>
        <div className="mois-buttons">
          {moisDisponibles.map((mois, index) => (
            <button
              key={index}
              onClick={() => handleMoisClick(mois)}
              className={moisPaiement.includes(mois) ? "selected" : ""}
              aria-label={`Sélectionner ${mois}`}
            >
              {mois}
            </button>
          ))}
        </div>
      </div>

      <div className="montant-total">
        <strong>Montant Total:</strong> {montantTotal} DH
      </div>

      <button
        onClick={handleSubmit}
        className="ajouter-button"
        aria-label={editingStagiaire ? "Mettre à jour" : "Ajouter"}
      >
        {editingStagiaire ? "Mettre à Jour" : "Ajouter"}
      </button>
    </div>
  );
};

// Main App Component
function PaiementApp() {
  // Initialiser l'état avec les données du localStorage
  const [stagiaires, setStagiaires] = useState(() => {
    try {
      const savedStagiaires = localStorage.getItem("stagiaires");
      return savedStagiaires ? JSON.parse(savedStagiaires) : [];
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
      return [];
    }
  });
  
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState("liste");
  const [paymentModal, setPaymentModal] = useState(false);
  const [stagiaireIdForPayment, setStagiaireIdForPayment] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState(200);
  const [editingStagiaire, setEditingStagiaire] = useState(null);

  // Sauvegarder les données dans localStorage à chaque modification
  useEffect(() => {
    try {
      localStorage.setItem("stagiaires", JSON.stringify(stagiaires));
      console.log("Données sauvegardées dans localStorage:", stagiaires);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des données:", error);
    }
  }, [stagiaires]);

  const handleAjoutStagiaire = (stagiaire) => {
    if (editingStagiaire) {
      setStagiaires((prev) =>
        prev.map((s) => (s.cin === stagiaire.cin ? stagiaire : s))
      );
      setEditingStagiaire(null);
    } else {
      setStagiaires((prev) => [...prev, stagiaire]);
    }
  };

  const handleDelete = (cin) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce stagiaire?")) {
      setStagiaires(stagiaires.filter((stagiaire) => stagiaire.cin !== cin));
    }
  };

  const handleDeleteAll = () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer tous les stagiaires?")) {
      setStagiaires([]);
      localStorage.removeItem("stagiaires");
    }
  };

  const handleEdit = (stagiaire) => {
    setEditingStagiaire(stagiaire);
    setPage("form");
  };

  const handleAjoutPaiement = (cin) => {
    setStagiaireIdForPayment(cin);
    setPaymentModal(true);
  };

  const handleSubmitPayment = () => {
    if (paymentAmount < 200 || paymentAmount % 200 !== 0) {
      alert("Le paiement doit être un multiple de 200 DH.");
      return;
    }

    setStagiaires(
      stagiaires.map((stagiaire) => {
        if (stagiaire.cin === stagiaireIdForPayment) {
          const monthsToAdd = paymentAmount / 200;
          let newMoisPaiement = stagiaire.moisPaiement
            ? [...stagiaire.moisPaiement]
            : [];

          for (let i = 0; i < monthsToAdd; i++) {
            const lastMonth =
              newMoisPaiement[newMoisPaiement.length - 1] || null;
            const nextMonthIndex = lastMonth
              ? moisDisponibles.indexOf(lastMonth) + 1
              : 0;

            if (
              nextMonthIndex < moisDisponibles.length &&
              !newMoisPaiement.includes(moisDisponibles[nextMonthIndex])
            ) {
              newMoisPaiement.push(moisDisponibles[nextMonthIndex]);
            }
          }

          return {
            ...stagiaire,
            moisPaiement: newMoisPaiement,
            montant: (stagiaire.montant || 0) + paymentAmount,
          };
        }
        return stagiaire;
      })
    );

    setPaymentModal(false);
    
    setPaymentAmount(200);
  };

  return (
    <div className="paiement-app-container">
      <div className="nav-buttons">
        <button
          onClick={() => setPage("form")}
          className={page === "form" ? "active" : ""}
          aria-label="Aller au formulaire"
        >
          
          <i className="fas fa-plus"></i>
        </button>
        <button
          onClick={() => setPage("liste")}
          className={page === "liste" ? "active" : ""}
          aria-label="Voir la liste des stagiaires"
        >
         
          <i className="fas fa-list"></i>
        </button>
      </div>

      {page === "form" ? (
        <StagiaireForm
          onAdd={handleAjoutStagiaire}
          editingStagiaire={editingStagiaire}
          stagiaires={stagiaires}
        />
      ) : (
        <PageList
          stagiaires={stagiaires}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleDeleteAll={handleDeleteAll}
          handleAjoutPaiement={handleAjoutPaiement}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      )}

      {paymentModal && (
        <PaymentModal
          paymentAmount={paymentAmount}
          setPaymentAmount={setPaymentAmount}
          handleSubmitPayment={handleSubmitPayment}
          setPaymentModal={setPaymentModal}
        />
      )}
    </div>
  );
}

export default PaiementApp;