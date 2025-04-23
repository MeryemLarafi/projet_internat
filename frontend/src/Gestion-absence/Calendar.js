import React, { useState, useEffect, useCallback } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./Calendar.css";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { absenceService } from "../services/api";

// Configuration du localizer avec moment
const localizer = momentLocalizer(moment);

// Configuration des messages en français
const messages = {
  next: "Suivant",
  previous: "Précédent",
  today: "Aujourd'hui",
  month: "Mois",
  week: "Semaine",
  day: "Jour",
  agenda: "Agenda",
  date: "Date",
  time: "Heure",
  event: "Événement",
};

const Calendaar = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedEvent, setEditedEvent] = useState(null);
  const [view, setView] = useState(Views.MONTH);
  const [date, setDate] = useState(new Date());
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    nom: "",
    telephone: "",
    chambre: "",
    typeReclamation: "absence",
    dateDebut: "",
    dateFin: "",
    duree: "",
    motif: "",
    repas: [],
    status: "accepted"
  });

  // Charger les événements du calendrier depuis l'API
  const loadCalendarEvents = useCallback(async () => {
    try {
      // Obtenir les dates de début et de fin en fonction de la vue actuelle
      const startOfPeriod = moment(date).startOf(
        view === Views.MONTH ? 'month' :
        view === Views.WEEK ? 'week' : 'day'
      ).toISOString();
      
      const endOfPeriod = moment(date).endOf(
        view === Views.MONTH ? 'month' :
        view === Views.WEEK ? 'week' : 'day'
      ).toISOString();
      
      // Appeler l'API pour obtenir les événements
      const response = await absenceService.getCalendarEvents({
        start: startOfPeriod,
        end: endOfPeriod,
        view: view
      });
      
      // Transformer les données pour le calendrier
      const calendarEvents = response.data.map(event => ({
        title: event.title,
        start: new Date(event.start),
        end: new Date(event.end),
        allDay: event.allDay,
        resource: event.resource
      }));
      
      setEvents(calendarEvents);
    } catch (error) {
      console.error("Erreur lors du chargement des événements:", error);
      setNotification({
        show: true,
        message: "Erreur lors du chargement des événements du calendrier",
        type: "error"
      });
    }
  }, [date, view]);

  useEffect(() => {
    loadCalendarEvents();
  }, [view, date, loadCalendarEvents]);

  // Fonction pour filtrer les événements en fonction de la vue et de la date
  const filterEventsByView = useCallback((currentView, currentDate) => {
    const startOfPeriod = moment(currentDate).startOf(
      currentView === Views.MONTH ? 'month' :
      currentView === Views.WEEK ? 'week' :
      'day'
    );
    
    const endOfPeriod = moment(currentDate).endOf(
      currentView === Views.MONTH ? 'month' :
      currentView === Views.WEEK ? 'week' :
      'day'
    );

    return events.filter(event => {
      const eventStart = moment(event.start);
      const eventEnd = moment(event.end);
      
      return (
        (eventStart.isSameOrAfter(startOfPeriod) && eventStart.isSameOrBefore(endOfPeriod)) ||
        (eventEnd.isSameOrAfter(startOfPeriod) && eventEnd.isSameOrBefore(endOfPeriod)) ||
        (eventStart.isBefore(startOfPeriod) && eventEnd.isAfter(endOfPeriod))
      );
    });
  }, [events]);

  // Mettre à jour les événements filtrés quand la vue ou la date change
  useEffect(() => {
    const filtered = filterEventsByView(view, date);
    setFilteredEvents(filtered);
  }, [view, date, filterEventsByView]);

  const handleSelectEvent = (event) => {
    setSelectedEvent(event.resource);
    setEditedEvent({ ...event.resource });
    setIsEditing(false);
  };

  const eventStyleGetter = (event) => {
    const style = {
      backgroundColor: event.resource.typeReclamation === "absence" ? "#4A90E2" : "#607D8B",
      borderRadius: "4px",
      opacity: 0.85,
      color: "white",
      border: "0px",
      display: "block",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    };
    return { style };
  };

  const handleNavigate = (newDate) => {
    setDate(newDate);
  };

  const handleView = (newView) => {
    setView(newView);
  };

  const handleDeleteEvent = async () => {
    if (selectedEvent) {
      try {
        // Supprimer l'événement via l'API
        await absenceService.deleteAbsence(selectedEvent._id);
        
        // Mettre à jour la liste des événements
        const updatedEvents = events.filter(
          (event) => event.resource._id !== selectedEvent._id
        );
        setEvents(updatedEvents);
        setSelectedEvent(null);
        
        // Afficher une notification de succès
        setNotification({
          show: true,
          message: "L'événement a été supprimé avec succès",
          type: "success"
        });
        
        // Masquer la notification après 3 secondes
        setTimeout(() => {
          setNotification({ show: false, message: "", type: "" });
        }, 3000);
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        setNotification({
          show: true,
          message: "Erreur lors de la suppression de l'événement",
          type: "error"
        });
      }
    }
  };

  // Gestion des changements dans le formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedEvent((prev) => ({ ...prev, [name]: value }));
  };

  // Sauvegarde des modifications
  const handleSaveEdit = async () => {
    // Validation des repas pour les restaurations
    if (editedEvent.typeReclamation === "restauration" && editedEvent.repas.length === 0) {
      setNotification({
        show: true,
        message: "Veuillez sélectionner au moins un repas pour la restauration",
        type: "error"
      });
      return;
    }

    try {
      // Mettre à jour l'événement via l'API
      await absenceService.updateAbsence(selectedEvent._id, editedEvent);
      
      // Recharger les événements pour avoir la liste à jour
      await loadCalendarEvents();
      
      // Fermer le formulaire d'édition
      setIsEditing(false);
      setSelectedEvent(null);
      
      // Afficher une notification de succès
      setNotification({
        show: true,
        message: "Modification enregistrée avec succès",
        type: "success"
      });
      
      // Masquer la notification après 3 secondes
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      setNotification({
        show: true,
        message: "Erreur lors de la mise à jour de l'événement",
        type: "error"
      });
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filtrer les événements par recherche et par vue
  const searchedEvents = filteredEvents.filter((event) =>
    event.resource.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Titre du document avec la période
    doc.setFontSize(16);
    let periodText = '';
    if (view === Views.MONTH) {
      periodText = `Liste des absences - Mois de ${moment(date).format('MMMM YYYY')}`;
    } else if (view === Views.WEEK) {
      const startOfWeek = moment(date).startOf('week');
      const endOfWeek = moment(date).endOf('week');
      periodText = `Liste des absences - Semaine du ${startOfWeek.format('DD MMMM')} au ${endOfWeek.format('DD MMMM YYYY')}`;
    } else if (view === Views.DAY) {
      periodText = `Liste des absences - ${moment(date).format('DD MMMM YYYY')}`;
    }
    doc.text(periodText, 14, 15);
    
    // Préparation des données pour le tableau
    const tableData = searchedEvents.map(event => [
      event.resource.nom,
      event.resource.typeReclamation === "absence" ? "Absence" : "Restauration",
      moment(event.start).format('DD/MM/YYYY'),
      moment(event.end).format('DD/MM/YYYY'),
      event.resource.chambre,
      event.resource.motif
    ]);

    // Création du tableau
    autoTable(doc, {
      head: [['Nom', 'Type', 'Date Début', 'Date Fin', 'Chambre', 'Motif']],
      body: tableData,
      startY: 30,
      theme: 'grid',
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontSize: 10,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 9
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      }
    });

    // Sauvegarde du PDF
    doc.save(`absences_${moment(date).format('YYYY-MM-DD')}.pdf`);
  };

  const handleSelectSlot = (slotInfo) => {
    // Définir la date de début et de fin pour le nouvel événement
    const startDate = new Date(slotInfo.start);
    const endDate = new Date(slotInfo.end);
    
    // Formater les dates pour l'affichage dans le formulaire
    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];
    
    // Initialiser le nouvel événement avec les dates sélectionnées
    setNewEvent({
      ...newEvent,
      dateDebut: formattedStartDate,
      dateFin: formattedEndDate
    });
    
    // Activer le mode d'ajout d'événement
    setIsAddingEvent(true);
  };

  const handleNewEventChange = (e) => {
    const { name, value } = e.target;
    
    // Mettre à jour l'état avec la nouvelle valeur
    const updatedEvent = {
      ...newEvent,
      [name]: value
    };
    
    // Si la date de début ou de fin est modifiée, calculer automatiquement la durée
    if (name === "dateDebut" || name === "dateFin") {
      // Vérifier si les deux dates sont définies
      if (updatedEvent.dateDebut && updatedEvent.dateFin) {
        // Convertir les dates en objets Date
        const startDate = new Date(updatedEvent.dateDebut);
        const endDate = new Date(updatedEvent.dateFin);
        
        // Calculer la différence en jours
        const diffTime = Math.abs(endDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 pour inclure le jour de fin
        
        // Mettre à jour la durée
        updatedEvent.duree = `${diffDays} jour${diffDays > 1 ? 's' : ''}`;
      }
    }
    
    // Mettre à jour l'état
    setNewEvent(updatedEvent);
  };

  const handleRepasChange = (e) => {
    const { checked, value } = e.target;
    let updatedRepas;
    
    if (checked) {
      updatedRepas = [...newEvent.repas, value];
    } else {
      updatedRepas = newEvent.repas.filter(repas => repas !== value);
    }
    
    setNewEvent({
      ...newEvent,
      repas: updatedRepas
    });
  };

  const handleSaveNewEvent = async () => {
    // Validation des champs obligatoires
    if (!newEvent.nom || !newEvent.telephone || !newEvent.chambre || !newEvent.dateDebut || !newEvent.dateFin || !newEvent.motif) {
      setNotification({
        show: true,
        message: "Veuillez remplir tous les champs obligatoires",
        type: "error"
      });
      return;
    }
    
    // Validation des repas pour les restaurations
    if (newEvent.typeReclamation === "restauration" && newEvent.repas.length === 0) {
      setNotification({
        show: true,
        message: "Veuillez sélectionner au moins un repas pour la restauration",
        type: "error"
      });
      return;
    }
    
    try {
      // Créer un nouvel événement via l'API
      await absenceService.createAbsence({
        ...newEvent,
        status: "accepted" // Assurer que le statut est "accepted" pour l'affichage dans le calendrier
      });
      
      // Recharger les événements pour avoir la liste à jour
      await loadCalendarEvents();
      
      // Réinitialiser le formulaire et désactiver le mode d'ajout
      setNewEvent({
        nom: "",
        telephone: "",
        chambre: "",
        typeReclamation: "absence",
        dateDebut: "",
        dateFin: "",
        duree: "",
        motif: "",
        repas: [],
        status: "accepted"
      });
      setIsAddingEvent(false);
      
      // Afficher une notification de succès
      setNotification({
        show: true,
        message: "L'événement a été ajouté avec succès",
        type: "success"
      });
      
      // Masquer la notification après 3 secondes
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
    } catch (error) {
      console.error("Erreur lors de l'ajout:", error);
      setNotification({
        show: true,
        message: "Erreur lors de l'ajout de l'événement",
        type: "error"
      });
    }
  };

  const handleCancelNewEvent = () => {
    // Réinitialiser le formulaire et désactiver le mode d'ajout
    setNewEvent({
      nom: "",
      telephone: "",
      chambre: "",
      typeReclamation: "absence",
      dateDebut: "",
      dateFin: "",
      duree: "",
      motif: "",
      repas: [],
      status: "accepted"
    });
    setIsAddingEvent(false);
  };

  return (
    <div className={`calendar-container ${selectedEvent || isAddingEvent ? "blur-active" : ""}`}>
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          <i className={`fas ${notification.type === "success" ? "fa-check-circle" : "fa-exclamation-circle"}`}></i>
          {notification.message}
        </div>
      )}
      <div className="calendar-header">
        <h2>Calendrier des Absences et Restaurations Acceptées</h2>
      </div>

      <div className="calendar-controls">
        <div className="search-export-container">
          <div className="search-wrapper">
            <input
              type="text"
              placeholder="Rechercher par nom..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
          </div>
          <button className="export-btn" onClick={exportToPDF}>
            <i className="fas fa-file-pdf"></i> Exporter en PDF
          </button>
        </div>
      </div>

      <div style={{ height: "600px" }}>
        <Calendar
          localizer={localizer}
          events={searchedEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ margin: "20px" }}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          selectable={true}
          messages={messages}
          view={view}
          onView={handleView}
          date={date}
          onNavigate={handleNavigate}
          defaultView={Views.MONTH}
          views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
          culture="fr"
        />
      </div>

      {selectedEvent && <div className="calendar-overlay"></div>}
      {isAddingEvent && <div className="calendar-overlay"></div>}

      {selectedEvent && (
        <div className="event-details">
          <h3>
            <span className={`event-icon ${selectedEvent.typeReclamation}`}>
              {selectedEvent.typeReclamation === "absence" ? "🚪" : "🍽️"}
            </span>{" "}
            {isEditing ? "Modifier" : "Détails de"}{" "}
            {selectedEvent.typeReclamation === "absence" ? "l'absence" : "la restauration"}
          </h3>

          {isEditing ? (
            <div className="edit-form">
              <div>
                <label>Type:</label>
                <select
                  name="typeReclamation"
                  value={editedEvent.typeReclamation}
                  onChange={handleInputChange}
                >
                  <option value="absence">Absence</option>
                  <option value="restauration">Restauration</option>
                </select>
              </div>
              <div>
                <label>Nom:</label>
                <input
                  type="text"
                  name="nom"
                  value={editedEvent.nom}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label>Téléphone:</label>
                <input
                  type="text"
                  name="telephone"
                  value={editedEvent.telephone}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label>Chambre:</label>
                <input
                  type="text"
                  name="chambre"
                  value={editedEvent.chambre}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label>Début:</label>
                <input
                  type="date"
                  name="dateDebut"
                  value={moment(editedEvent.dateDebut).format("YYYY-MM-DD")}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label>Fin:</label>
                <input
                  type="date"
                  name="dateFin"
                  value={moment(editedEvent.dateFin).format("YYYY-MM-DD")}
                  onChange={handleInputChange}
                />
              </div>
              {editedEvent.typeReclamation === "absence" ? (
                <div>
                  <label>Durée:</label>
                  <input
                    type="text"
                    name="duree"
                    value={editedEvent.duree}
                    onChange={handleInputChange}
                  />
                </div>
              ) : (
                <div>
                  <label>Repas:</label>
                  <div className="checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={editedEvent.repas.includes("BREAKFAST")}
                        onChange={(e) => {
                          const updatedRepas = e.target.checked
                            ? [...editedEvent.repas, "BREAKFAST"]
                            : editedEvent.repas.filter(repas => repas !== "BREAKFAST");
                          setEditedEvent(prev => ({ ...prev, repas: updatedRepas }));
                        }}
                      />
                      Petit-déjeuner
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={editedEvent.repas.includes("LUNCH")}
                        onChange={(e) => {
                          const updatedRepas = e.target.checked
                            ? [...editedEvent.repas, "LUNCH"]
                            : editedEvent.repas.filter(repas => repas !== "LUNCH");
                          setEditedEvent(prev => ({ ...prev, repas: updatedRepas }));
                        }}
                      />
                      Déjeuner
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={editedEvent.repas.includes("DINNER")}
                        onChange={(e) => {
                          const updatedRepas = e.target.checked
                            ? [...editedEvent.repas, "DINNER"]
                            : editedEvent.repas.filter(repas => repas !== "DINNER");
                          setEditedEvent(prev => ({ ...prev, repas: updatedRepas }));
                        }}
                      />
                      Dîner
                    </label>
                  </div>
                </div>
              )}
              <div>
                <label>Motif:</label>
                <textarea
                  name="motif"
                  value={editedEvent.motif}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          ) : (
            <>
              <p><strong>Nom:</strong> {selectedEvent.nom}</p>
              <p><strong>Téléphone:</strong> {selectedEvent.telephone}</p>
              <p><strong>Chambre:</strong> {selectedEvent.chambre}</p>
              <p><strong>Début:</strong> {new Date(selectedEvent.dateDebut).toLocaleDateString("fr-FR")}</p>
              <p><strong>Fin:</strong> {new Date(selectedEvent.dateFin).toLocaleDateString("fr-FR")}</p>
              {selectedEvent.typeReclamation === "absence" ? (
                <p><strong>Durée:</strong> {selectedEvent.duree}</p>
              ) : (
                <p><strong>Repas concernés:</strong> {selectedEvent.repas.join(", ")}</p>
              )}
              <p><strong>Motif:</strong> {selectedEvent.motif}</p>
            </>
          )}

          <div className="event-actions">
            {isEditing ? (
              <>
                <button className="save-btn" onClick={handleSaveEdit}>
                  Sauvegarder
                </button>
                <button className="cancel-btn" onClick={() => setIsEditing(false)}>
                  Annuler
                </button>
              </>
            ) : (
              <>
                <button className="edit-btn" onClick={() => setIsEditing(true)}>
                  Modifier
                </button>
                <button className="delete-btn" onClick={handleDeleteEvent}>
                  Supprimer
                </button>
                <button className="close-btn" onClick={() => setSelectedEvent(null)}>
                  Fermer
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {isAddingEvent && (
        <div className="event-details">
          <h3>
            <span className="event-icon">
              {newEvent.typeReclamation === "absence" ? "🚪" : "🍽️"}
            </span>{" "}
            Ajouter une {newEvent.typeReclamation === "absence" ? "absence" : "restauration"}
          </h3>

          <div className="edit-form">
            <div>
              <label>Type:</label>
              <select
                name="typeReclamation"
                value={newEvent.typeReclamation}
                onChange={handleNewEventChange}
              >
                <option value="absence">Absence en hébergement</option>
                <option value="restauration">Absence en restauration</option>
              </select>
            </div>
            <div>
              <label>Nom:</label>
              <input
                type="text"
                name="nom"
                value={newEvent.nom}
                onChange={handleNewEventChange}
                placeholder="Nom de l'étudiant"
              />
            </div>
            <div>
              <label>Téléphone:</label>
              <input
                type="text"
                name="telephone"
                value={newEvent.telephone}
                onChange={handleNewEventChange}
                placeholder="Numéro de téléphone"
              />
            </div>
            <div>
              <label>Chambre:</label>
              <input
                type="text"
                name="chambre"
                value={newEvent.chambre}
                onChange={handleNewEventChange}
                placeholder="Numéro de chambre"
              />
            </div>
            <div>
              <label>Début:</label>
              <input
                type="date"
                name="dateDebut"
                value={newEvent.dateDebut}
                onChange={handleNewEventChange}
              />
            </div>
            <div>
              <label>Fin:</label>
              <input
                type="date"
                name="dateFin"
                value={newEvent.dateFin}
                onChange={handleNewEventChange}
              />
            </div>
            {newEvent.typeReclamation === "absence" ? (
              <div>
                <label>Durée:</label>
                <input
                  type="text"
                  name="duree"
                  value={newEvent.duree}
                  readOnly
                  placeholder="Durée calculée automatiquement"
                />
              </div>
            ) : (
              <div>
                <label>Repas:</label>
                <div className="checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={newEvent.repas.includes("BREAKFAST")}
                      onChange={(e) => handleRepasChange({ target: { checked: e.target.checked, value: "BREAKFAST" } })}
                    />
                    Petit-déjeuner
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={newEvent.repas.includes("LUNCH")}
                      onChange={(e) => handleRepasChange({ target: { checked: e.target.checked, value: "LUNCH" } })}
                    />
                    Déjeuner
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={newEvent.repas.includes("DINNER")}
                      onChange={(e) => handleRepasChange({ target: { checked: e.target.checked, value: "DINNER" } })}
                    />
                    Dîner
                  </label>
                </div>
              </div>
            )}
            <div>
              <label>Motif:</label>
              <textarea
                name="motif"
                value={newEvent.motif}
                onChange={handleNewEventChange}
                placeholder="Motif de l'absence"
              />
            </div>
          </div>

          <div className="event-actions">
            <button className="save-btn" onClick={handleSaveNewEvent}>
              Ajouter
            </button>
            <button className="cancel-btn" onClick={handleCancelNewEvent}>
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendaar;
