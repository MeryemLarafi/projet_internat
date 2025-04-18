import React from 'react';
import './StockNav.css';

function StockNav({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'stock-global', label: 'Stock Global' },
    { id: 'cuisinier', label: 'Cuisine' },
    { id: 'fournisseur', label: 'Fournisseurs' },
  ];

  return (
    <div className="stock-nav">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default StockNav;