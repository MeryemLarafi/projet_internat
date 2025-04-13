// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './composants/HomePage.js';
// import CommandPage from './composants/CommandPage';
// import SautagePage from './composants/SautagePage';
// import GestionStock from './composants/GestionStock';
// import GestionCout from './composants/GestionCout';
// import EtatChantier from './composants/EtatChantier';
import SidBar from './composants/Sidebar.js';
import LoginCard from './login.js'
// import DashboardPage from './composants/DashboardPage';
// import ArchivePage from './composants/ArchivePage';
// import SecurityPage from './composants/SecurityPage';
import GestionDossier from './composants/GestionDossier.js'; 
import Calendar from './pages/Calendar.js';
import AdminDemmande from './pages/AdminDemmande.js';
import Historique from './pages/Historique.js';
import DemandeAbsence from './pages/DemmandeAbsence.js';


function App() {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };


  return (
    <div className={`app-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
    <Router>
      <SidBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/gestion-dossier" element={<GestionDossier />} />
        <Route path="/LoginCard" element={<LoginCard />} />
        <Route path="/pages/Calendar" element={<Calendar />} />
        <Route path="/pages/AdminDemmande" element={<AdminDemmande />} />
        <Route path="/pages/Historique" element={<Historique />} />
        <Route path="/pages/DemmandeAbsence" element={<DemandeAbsence />} />
        {/* <Route path="/command" element={<CommandPage />} />
        <Route path="/sautage" element={<SautagePage />} />
        <Route path="/gestion-stock" element={<GestionStock />} />
        <Route path="/gestion-cout" element={<GestionCout />} />
        <Route path="/etat-chantier" element={<EtatChantier />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/archive" element={<ArchivePage />} /> 
        <Route path="/security" element={<SecurityPage/>} />  */}
      </Routes>
    </Router>
   </div> 
  );
}

export default App;
