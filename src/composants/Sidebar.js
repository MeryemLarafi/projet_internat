import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Importez Link à partir de 'react-router-dom'
import '../styles/Sidebare.css';
import 'boxicons/css/boxicons.min.css';

function SidBar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    menuBtnChange();
  };

  const menuBtnChange = () => {
    const closeBtn = document.querySelector("#btn");
    if (isSidebarOpen) {
      closeBtn.classList.replace("bx-menu-alt-right", "bx-menu");
    } else {
      closeBtn.classList.replace("bx-menu", "bx-menu-alt-right");
    }
  };

  return (
    <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
      <div className="logo-details">
        <center><div className="logo_name"> Ofppt internat</div></center>
        <i className="bx bx-menu" id="btn" onClick={toggleSidebar}></i>
      </div>
      <ul className="nav-list">
        <li>
          <Link to="/">
            <i className="bx bx-home-alt"></i> {/* Icône pour "Home" */}
            <span className="links_name">Home</span>
          </Link>
          <span className="tooltip">Home</span>
        </li>
        <li>
          <Link to="/">
            <i className="bx bx-bed"></i> {/* Icône pour gestion des chambres */}
            <span className="links_name">Gestion de chambre</span>
          </Link>
          <span className="tooltip">Gestion de chambre</span>
        </li>
        <li>
          <Link to="/pages/Calendar">
            <i className="bx bx-calendar-x"></i>
            <span className="links_name">Calendrier des absences</span>
          </Link>
          <span className="tooltip">Calendrier des absences</span>
        </li>
        <li>
          <Link to="/pages/AdminDemmande">
            <i className="bx bx-list-check"></i>
            <span className="links_name">Gestion des demandes</span>
          </Link>
          <span className="tooltip">Gestion des demandes</span>
        </li>
        <li>
          <Link to="/pages/Historique">
            <i className="bx bx-history"></i>
            <span className="links_name">Historique des demandes</span>
          </Link>
          <span className="tooltip">Historique des demandes</span>
        </li>
        <li>
          <Link to="/pages/DemmandeAbsence">
            <i className="bx bx-file"></i>
            <span className="links_name">Demandes d'absence</span>
          </Link>
          <span className="tooltip">Demandes d'absence</span>
        </li>
        <li>
          <Link to="/">
            <i className="bx bx-cube"></i>
            <span className="links_name">Gestion de stock</span>
          </Link>
          <span className="tooltip">Gestion de stock</span>
        </li>
        <li>
          <Link to="/">
            <i className="bx bx-credit-card"></i>
            <span className="links_name">Gestion des paiements</span>
          </Link>
          <span className="tooltip">Gestion des paiements</span>
        </li>
        <li>
          <Link to="/gestion-dossier">
            <i className="bx bx-folder-open"></i>
            <span className="links_name">Gestion des dossiers</span>
          </Link>
          <span className="tooltip">Gestion des dossiers</span>
        </li>
        <li>
          <Link to="">
            <i className="bx bx-bar-chart-alt"></i>
            <span className="links_name">Dashboard</span>
          </Link>
          <span className="tooltip">Dashboard</span>
        </li>
        <li>
          <Link to="/notifications">
            <i className="bx bx-bell"></i>
            <span className="links_name">Notifications</span>
          </Link>
          <span className="tooltip">Notifications</span>
        </li>
        <li>
          <Link to="/LoginCard">
            <i className="bx bx-user-circle"></i>
            <span className="links_name">Login</span>
          </Link>
          <span className="tooltip">Login</span>
        </li>
      </ul>
    </div>
  );
}

export default SidBar;
