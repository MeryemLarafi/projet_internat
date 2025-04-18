import React, { useState, useEffect } from 'react';
import './Fournisseur.css';
import { FaSearch, FaUsers, FaPlus, FaEdit, FaTrash, FaPhone } from 'react-icons/fa';

function Fournisseur({ products, setProducts }) {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [suppliers, setSuppliers] = useState(() => {
    const savedSuppliers = localStorage.getItem('suppliers');
    return savedSuppliers ? JSON.parse(savedSuppliers) : [];
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [showSelectionModal, setShowSelectionModal] = useState(false);
  const [showSuppliersModal, setShowSuppliersModal] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState(null);
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    contact: '+212'
  });

  useEffect(() => {
    localStorage.setItem('suppliers', JSON.stringify(suppliers));
  }, [suppliers]);

  const handleProductSelection = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleContactChange = (e) => {
    let value = e.target.value;
    if (!value.startsWith('+212')) {
      value = '+212' + value.replace(/^\+212/, '');
    }
    if (value.length > 13) {
      value = value.slice(0, 13);
    }
    setNewSupplier({ ...newSupplier, contact: value });
  };

  const handleAddSupplier = () => {
    if (!newSupplier.name || newSupplier.contact.length < 13) {
      alert('Veuillez remplir tous les champs avec un numéro valide (+212 suivi de 9 chiffres)');
      return;
    }
    
    const supplier = {
      id: Date.now(),
      ...newSupplier,
      assignedProducts: []
    };
    
    setSuppliers([...suppliers, supplier]);
    setNewSupplier({ name: '', contact: '+212' });
    setShowAddForm(false);
  };

  const handleDeleteSupplier = (supplierId) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce fournisseur ?')) {
      const supplierToDelete = suppliers.find(s => s.id === supplierId);
      setSuppliers(suppliers.filter((s) => s.id !== supplierId));
      setProducts(products.map(p => 
        p.supplier === supplierToDelete.name 
          ? { ...p, supplier: 'Non assigné' } 
          : p
      ));
    }
  };

  const handleAssignSupplier = (supplier) => {
    setCurrentSupplier(supplier);
    setSelectedProducts(supplier.assignedProducts || []);
    setShowSelectionModal(true);
  };

  const handleSaveSelection = () => {
    if (selectedProducts.length > 0) {
      setProducts((prev) =>
        prev.map((product) =>
          selectedProducts.includes(product.id)
            ? { ...product, supplier: currentSupplier.name }
            : product
        )
      );
      setSuppliers((prev) =>
        prev.map((s) =>
          s.id === currentSupplier.id
            ? { ...s, assignedProducts: selectedProducts }
            : s
        )
      );
    }
    setSelectedProducts([]);
    setShowSelectionModal(false);
    setCurrentSupplier(null);
  };

  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.contact.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatPhoneNumber = (number) => {
    const digits = number.replace('+212', '');
    return `+212 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  };

  return (
    <div className="fournisseur-container">
      <div className="container">
        <div className="controls-container">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="action-buttons">
            <button className="action-btn" onClick={() => setShowSuppliersModal(true)}>
              <FaUsers /> Voir Fournisseurs
            </button>
            <button className="action-btn" onClick={() => setShowAddForm(true)}>
              <FaPlus /> Ajouter Fournisseur
            </button>
          </div>
        </div>

        {showAddForm && (
          <div className="modal">
            <div className="modal-content">
              <button className="close-btn" onClick={() => setShowAddForm(false)}>×</button>
              <h2>Ajouter un Fournisseur</h2>
              <form>
                <input
                  type="text"
                  placeholder="Nom du fournisseur"
                  value={newSupplier.name}
                  onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                />
                <input
                  type="tel"
                  placeholder="+212 6XX XXX XXX"
                  value={newSupplier.contact}
                  onChange={handleContactChange}
                  pattern="\+212\d{9}"
                  maxLength="13"
                />
                <button type="button" onClick={handleAddSupplier}>
                  Ajouter
                </button>
              </form>
            </div>
          </div>
        )}

        {showSelectionModal && (
          <div className="modal">
            <div className="modal-content">
              <button className="close-btn" onClick={() => setShowSelectionModal(false)}>×</button>
              <h2>Sélectionner des Produits pour {currentSupplier.name}</h2>
              <div className="products-selection">
                {products.map((product) => (
                  <label key={product.id} className="product-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => handleProductSelection(product.id)}
                    />
                    {product.name}
                  </label>
                ))}
              </div>
              <button type="button" onClick={handleSaveSelection}>
                Enregistrer
              </button>
            </div>
          </div>
        )}

        {showSuppliersModal && (
          <div className="modal">
            <div className="modal-content suppliers-list-modal">
              <button className="close-btn" onClick={() => setShowSuppliersModal(false)}>×</button>
              <h2>Liste des Fournisseurs</h2>
              {suppliers.length > 0 ? (
                <ul className="suppliers-list">
                  {suppliers.map((supplier) => (
                    <li key={supplier.id} className="supplier-item">
                      <div className="supplier-info">
                        <span className="supplier-name">{supplier.name}</span>
                        <div className="contact-info">
                          <FaPhone className="phone-icon" />
                          <a href={`tel:${supplier.contact}`} className="supplier-contact">
                            {formatPhoneNumber(supplier.contact)}
                          </a>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Aucun fournisseur disponible</p>
              )}
            </div>
          </div>
        )}

        <table className="table">
          <thead>
            <tr>
              <th>Nom du Fournisseur</th>
              <th>Contact</th>
              <th>Produits Assignés</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSuppliers.map((supplier) => {
              const supplierProducts = products.filter(p => p.supplier === supplier.name);
              return (
                <tr key={supplier.id}>
                  <td>{supplier.name}</td>
                  <td>
                    <div className="contact-info">
                      <FaPhone /> {formatPhoneNumber(supplier.contact)}
                    </div>
                  </td>
                  <td>
                    {supplierProducts.length > 0 ? (
                      <ul className="products-list">
                        {supplierProducts.map(product => (
                          <li key={product.id}>
                            {product.name} ({product.quantity} {product.unit})
                            <button 
                              className="remove-product-btn"
                              onClick={() => {
                                setProducts(prev => prev.map(p => 
                                  p.id === product.id ? { ...p, supplier: 'Non assigné' } : p
                                ));
                                setSuppliers(prev => prev.map(s => 
                                  s.id === supplier.id 
                                    ? { ...s, assignedProducts: s.assignedProducts.filter(id => id !== product.id) }
                                    : s
                                ));
                              }}
                            >
                              ×
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      'Aucun produit'
                    )}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="action-btn btn-edit icon-only"
                        onClick={() => handleAssignSupplier(supplier)}
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className="action-btn btn-delete icon-only"
                        onClick={() => handleDeleteSupplier(supplier.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Fournisseur;