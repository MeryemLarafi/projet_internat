import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from './composants/Sidebar';
import Calendar from './Gestion-absence/Calendar';
import AdminDemmande from './Gestion-absence/AdminDemmande';
import Historique from './Gestion-absence/Historique';
import DemandeAbsence from './Gestion-absence/DemmandeAbsence';
import StockPage from './Gestion_stock/StockPage';
import ChambreApp from './Gestion_chambre/ChambreApp';
import Dashboard from './composants/Dashboard';
import PaiementApp from './Gestion_paiement/PaiementApp';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { error: null, errorInfo: null };

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: '20px', color: 'red' }}>
          <h2>Something went wrong!</h2>
          <p>{this.state.error.toString()}</p>
          <pre>{this.state.errorInfo.componentStack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

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
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/admin-demmande" element={<AdminDemmande />} />
              <Route path="/historique" element={<Historique />} />
              <Route path="/demande-absence" element={<DemandeAbsence />} />
              <Route path="/gestion-stock" element={<StockPage />} />
              <Route path="/gestion-chambre/*" element={<ChambreApp />} />
              <Route path="/gestion-paiements" element={<PaiementApp/> }/>
              <Route path="/gestion-dossier" element={<div>Gestion des dossiers (Placeholder)</div>} />
              <Route path="/notifications" element={<div>Notifications (Placeholder)</div>} />
              <Route path="/login" element={<div>Login (Placeholder)</div>} />
            </Routes>
          </ErrorBoundary>
        </div>
      </Router>
    </div>
  );
}

export default App;