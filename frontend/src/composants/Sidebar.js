import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Sidebar.css';
import 'boxicons/css/boxicons.min.css';

function Sidebar({ isOpen, toggleSidebar }) {
  const handleLinkClick = () => {
    if (window.innerWidth <= 420) {
      toggleSidebar(); // Close sidebar on mobile after clicking a link
    }
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="logo-details">
        <center>
          <div className="logo_name">Ofppt internat</div>
        </center>
        <i
          className={`bx ${isOpen ? 'bx-menu' : 'bx-menu-alt-right'}`}
          id="btn"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        ></i>
      </div>
      <ul className="nav-list">
        <li>
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active' : '')} onClick={handleLinkClick}>
            <i className="bx bx-line-chart"></i>
            <span className="links_name">Dashboard</span>
          </NavLink>
          <span className="tooltip">Dashboard</span>
        </li>
        <li>
          <NavLink to="/gestion-chambre" className={({ isActive }) => (isActive ? 'active' : '')} onClick={handleLinkClick}>
            <i className="bx bx-bed"></i>
            <span className="links_name">Gestion de chambre</span>
          </NavLink>
          <span className="tooltip">Gestion de chambre</span>
        </li>
        <li>
          <NavLink to="/calendar" className={({ isActive }) => (isActive ? 'active' : '')} onClick={handleLinkClick}>
            <i className="bx bx-calendar-x"></i>
            <span className="links_name">Calendrier </span>
          </NavLink>
          <span className="tooltip">Calendrier</span>
        </li>
        <li>
          <NavLink to="/admin-demmande" className={({ isActive }) => (isActive ? 'active' : '')} onClick={handleLinkClick}>
            <i className="bx bx-list-check"></i>
            <span className="links_name">  les demandes</span>
          </NavLink>
          <span className="tooltip"> demandes</span>
        </li>
        <li>
          <NavLink to="/historique" className={({ isActive }) => (isActive ? 'active' : '')} onClick={handleLinkClick}>
            <i className="bx bx-history"></i>
            <span className="links_name">l'Historique </span>
          </NavLink>
          <span className="tooltip">Historique des demandes</span>
        </li>
        <li>
          <NavLink to="/demande-absence" className={({ isActive }) => (isActive ? 'active' : '')} onClick={handleLinkClick}>
            <i className="bx bx-file"></i>
            <span className="links_name">Demandes d'absence</span>
          </NavLink>
          <span className="tooltip">Demandes d'absence</span>
        </li>
        <li>
          <NavLink to="/gestion-stock" className={({ isActive }) => (isActive ? 'active' : '')} onClick={handleLinkClick}>
            <i className="bx bx-cube"></i>
            <span className="links_name">Gestion Stock</span>
          </NavLink>
          <span className="tooltip">Gestion Stock</span>
        </li>
        <li>
          <NavLink to="/gestion-paiements" className={({ isActive }) => (isActive ? 'active' : '')} onClick={handleLinkClick}>
            <i className="bx bx-credit-card"></i>
            <span className="links_name">Gestion paiements</span>
          </NavLink>
          <span className="tooltip">Gestion paiements</span>
        </li>
        <li>
          <NavLink to="/gestion-dossier" className={({ isActive }) => (isActive ? 'active' : '')} onClick={handleLinkClick}>
            <i className="bx bx-file"></i>
            <span className="links_name">Gestion des dossiers</span>
          </NavLink>
          <span className="tooltip">Gestion des dossiers</span>
        </li>
        <li>
          <NavLink to="/notifications" className={({ isActive }) => (isActive ? 'active' : '')} onClick={handleLinkClick}>
            <i className="bx bx-bell"></i>
            <span className="links_name">Notifications</span>
          </NavLink>
          <span className="tooltip">Notifications</span>
        </li>
        <li>
          <NavLink to="/login" className={({ isActive }) => (isActive ? 'active' : '')} onClick={handleLinkClick}>
            <i className="bx bx-user-circle"></i>
            <span className="links_name">Login</span>
          </NavLink>
          <span className="tooltip">Login</span>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;