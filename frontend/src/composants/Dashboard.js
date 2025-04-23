import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.css';
import 'boxicons';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  // State for slider
  const [currentIndex, setCurrentIndex] = useState(0);

  // State for statistical data
  const [stockData, setStockData] = useState({
    byZone: {},
    expiringSoon: []
  });
  
  const [paymentData, setPaymentData] = useState({
    monthly: {}
  });
  
  const [absenceData, setAbsenceData] = useState({
    byType: {
      'restaurant': 0,
      'hebergement': 0
    }
  });

  // Load data on component mount
  useEffect(() => {
    loadStockData();
    loadPaymentData();
    loadAbsenceData();
  }, []);

  // Function to load stock data
  const loadStockData = () => {
    try {
      const products = JSON.parse(localStorage.getItem('products')) || [];
      
      const byZone = {};
      const expiringSoon = [];
      
      products.forEach(product => {
        const zone = product.zone || 'Non assigné';
        if (!byZone[zone]) {
          byZone[zone] = 0;
        }
        byZone[zone] += product.quantity || 0;
        
        if (product.expirationDate) {
          const expirationDate = new Date(product.expirationDate);
          const today = new Date();
          const diffTime = expirationDate - today;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays > 0 && diffDays <= 30) {
            expiringSoon.push({
              name: product.name || 'Produit sans nom',
              quantity: product.quantity || 0,
              daysLeft: diffDays
            });
          }
        }
      });
      
      setStockData({
        byZone,
        expiringSoon
      });
    } catch (error) {
      console.error('Erreur lors du chargement des données de stock:', error);
    }
  };

  // Function to load payment data
  const loadPaymentData = () => {
    try {
      const stagiaires = JSON.parse(localStorage.getItem('stagiaires')) || [];
  
      const monthly = {};
  
      stagiaires.forEach(stagiaire => {
        if (Array.isArray(stagiaire.moisPaiement)) {
          stagiaire.moisPaiement.forEach(mois => {
            if (!monthly[mois]) {
              monthly[mois] = 0;
            }
            monthly[mois] += 1;
          });
        }
      });
  
      const montantParMois = {};
      for (const mois in monthly) {
        montantParMois[mois] = monthly[mois] * 200;
      }
  
      setPaymentData({
        monthly: montantParMois
      });
    } catch (error) {
      console.error('Erreur lors du chargement des données de paiement:', error);
    }
  };
  
  // Function to load absence data
  const loadAbsenceData = () => {
    try {
      const demandes = JSON.parse(localStorage.getItem("demandes")) || [];
      
      const demandesAcceptees = demandes.filter(
        (demande) => 
          demande.status === "accepted" && 
          (demande.typeReclamation === "absence" || demande.typeReclamation === "restauration")
      );
      
      const byType = {
        'restaurant': 0,
        'hebergement': 0
      };
      
      demandesAcceptees.forEach(demande => {
        if (demande.typeReclamation === "absence") {
          byType['hebergement']++;
        } else if (demande.typeReclamation === "restauration") {
          byType['restaurant']++;
        }
      });
      
      console.log("Données d'absence chargées depuis le calendrier:", byType);
      
      if (byType.restaurant === 0 && byType.hebergement === 0) {
        console.log("Aucune donnée d'absence trouvée, utilisation de données de test");
        byType.restaurant = 5;
        byType.hebergement = 3;
      }
      
      setAbsenceData({
        byType
      });
    } catch (error) {
      console.error('Erreur lors du chargement des données d\'absence:', error);
    }
  };

  // Prepare data for stock chart
  const stockByZoneData = {
    labels: Object.keys(stockData.byZone || {}),
    datasets: [
      {
        label: 'Quantité par zone',
        data: Object.values(stockData.byZone || {}),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for payment chart
  const paymentMonthlyData = {
    labels: Object.keys(paymentData.monthly || {}),
    datasets: [
      {
        label: 'Montant des paiements par mois (DH)',
        data: Object.values(paymentData.monthly || {}),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for absence chart
  const absenceByTypeData = {
    labels: ['Absences en hébergement', 'Absences en restauration'],
    datasets: [
      {
        label: 'Nombre d\'absences par type',
        data: [
          absenceData.byType.hebergement || 0,
          absenceData.byType.restaurant || 0
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 99, 132, 0.8)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Options for absence chart
  const absenceChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Statistiques des absences',
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  // Slider navigation handlers
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < 2) { // 3 cards total, so max index is 2
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Supprimé le header */}
      
      <div className="slider-container">
        <div 
          className="dashboard-slider" 
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          <div className="dashboard-card">
            <div className="card-icon">
              <box-icon name='package' type='solid' color='#4a5568' size='lg'></box-icon>
            </div>
            <h3>Gestion du Stock</h3>
            <div className="stats-container">
              <div className="stats-section">
                <h4>Quantités par zone</h4>
                <div className="chart-container">
                  <Pie data={stockByZoneData} options={{ responsive: true }} />
                </div>
              </div>
              <div className="stats-section">
                <h4>Produits proche de l'expiration</h4>
                <div className="expiring-list">
                  {stockData.expiringSoon && stockData.expiringSoon.length > 0 ? (
                    <ul>
                      {stockData.expiringSoon.map((item, index) => (
                        <li key={index}>
                          {item.name}: {item.quantity} unités (expire dans {item.daysLeft} jours)
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>Aucun produit proche de l'expiration</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="dashboard-card">
            <div className="card-icon">
              <box-icon name='money' type='solid' color='#4a5568' size='lg'></box-icon>
            </div>
            <h3>Gestion des Paiements</h3>
            <div className="stats-container">
              <div className="stats-section">
                <h4>Montant des factures par mois</h4>
                <div className="chart-container">
                  <Bar data={paymentMonthlyData} options={{ responsive: true }} />
                </div>
              </div>
            </div>
          </div>
          
          <div className="dashboard-card">
            <div className="card-icon">
              <box-icon name='calendar-check' type='solid' color='#4a5568' size='lg'></box-icon>
            </div>
            <h3>Gestion des Absences</h3>
            <div className="stats-container">
              <div className="stats-section">
                <h4>Statistiques des absences</h4>
                <div className="chart-container">
                  <Bar data={absenceByTypeData} options={absenceChartOptions} />
                </div>
                <div className="absence-legend">
                  <div className="legend-item">
                    <span className="legend-color hebergement"></span>
                    <span>Hébergement</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color restaurant"></span>
                    <span>Restauration</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="slider-nav">
        <button onClick={handlePrev} disabled={currentIndex === 0}>
          Previous
        </button>
        <button onClick={handleNext} disabled={currentIndex === 2}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Dashboard;