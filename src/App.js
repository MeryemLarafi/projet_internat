import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './composants/HomePage';
import Sidebar from './composants/Sidebar';
import Calendar from './pages/Calendar';
import AdminDemmande from './pages/AdminDemmande';
import Historique from './pages/Historique';
import DemandeAbsence from './pages/DemmandeAbsence';
import StockPage from './Gestion_stock/StockPage';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div>
      <Router>
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className={`home-section ${isSidebarOpen ? 'sidebar-open' : ''}`}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/admin-demmande" element={<AdminDemmande />} />
            <Route path="/historique" element={<Historique />} />
            <Route path="/demande-absence" element={<DemandeAbsence />} />
            <Route path="/gestion-stock" element={<StockPage />} />
            <Route path="/gestion-chambre" element={<div>Gestion des chambres (Placeholder)</div>} />
            <Route path="/gestion-paiements" element={<div>Gestion des paiements (Placeholder)</div>} />
            <Route path="/gestion-dossier" element={<div>Gestion des dossiers (Placeholder)</div>} />
            <Route path="/notifications" element={<div>Notifications (Placeholder)</div>} />
            <Route path="/login" element={<div>Login (Placeholder)</div>} />
            <Route path="/dashboard" element={<div>Dashboard (Placeholder)</div>} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;