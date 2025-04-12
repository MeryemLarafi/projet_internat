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
        <center><div className="logo_name">OFPPT</div></center>
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
          <Link to="/">
            <i className="bx bx-calendar-x"></i> {/* Icône pour gestion des absences */}
            <span className="links_name">Gestion d'absence</span>
          </Link>
          <span className="tooltip">Gestion d'absence</span>
        </li>
        <li>
          <Link to="/">
            <i className="bx bx-cube"></i> {/* Icône pour gestion du stock */}
            <span className="links_name">Gestion de stock</span>
          </Link>
          <span className="tooltip">Gestion de stock</span>
        </li>
        <li>
          <Link to="/">
            <i className="bx bx-credit-card"></i> {/* Icône pour gestion des paiements */}
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
          <Link to="/LoginCard">
            <i className="bx bx-bar-chart-alt"></i> {/* Icône pour le tableau de bord */}
            <span className="links_name">Dashboard</span>
          </Link>
          <span className="tooltip">Dashboard</span>
        </li>
          <li>
    <Link to="/notifications">
      <i className="bx bx-bell"></i> {/* Icône pour les notifications */}
      <span className="links_name">Notifications</span>
    </Link>
    <span className="tooltip">Notifications</span>
  </li>

      </ul>
    </div>
  );
}

export default SidBar;
