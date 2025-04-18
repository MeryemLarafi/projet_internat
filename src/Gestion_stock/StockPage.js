import React, { useState, useEffect } from 'react';
import StockNav from './StockNav';
import StockGlobal from './StockGlobal';
import Cuisinier from './Cuisinier';
import Fournisseur from './Fournisseur';

function StockPage() {
  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem('products');
    return savedProducts ? JSON.parse(savedProducts) : [];
  });
  const [activeTab, setActiveTab] = useState('stock-global');

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  const renderContent = () => {
    switch (activeTab) {
      case 'stock-global':
        return <StockGlobal products={products} setProducts={setProducts} />;
      case 'cuisinier':
        return <Cuisinier products={products} />;
      case 'fournisseur':
        return <Fournisseur products={products} setProducts={setProducts} />;
      default:
        return <StockGlobal products={products} setProducts={setProducts} />;
    }
  };

  return (
    <div className="stock-page">
      <StockNav activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="tab-content">{renderContent()}</div>
    </div>
  );
}

export default StockPage;