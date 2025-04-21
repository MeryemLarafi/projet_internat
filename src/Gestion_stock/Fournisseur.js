import React, { useState, useEffect } from 'react';
import { FaSearch, FaUsers, FaPlus, FaEdit, FaTrash, FaPhone } from 'react-icons/fa';
import styles from './Fournisseur.module.css';

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
    contact: '+212',
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
      assignedProducts: [],
    };

    setSuppliers([...suppliers, supplier]);
    setNewSupplier({ name: '', contact: '+212' });
    setShowAddForm(false);
  };

  const handleDeleteSupplier = (supplierId) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce fournisseur ?')) {
      const supplierToDelete = suppliers.find((s) => s.id === supplierId);
      setSuppliers(suppliers.filter((s) => s.id !== supplierId));
      setProducts(
        products.map((p) =>
          p.supplier === supplierToDelete.name ? { ...p, supplier: 'Non assigné' } : p
        )
      );
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
    <div className={styles.fournisseurContainer}>
      <div className={styles.container}>
        <div className={styles.controlsContainer}>
          <div className={styles.searchContainer}>
            <FaSearch className={styles.searchIcon} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Rechercher un fournisseur"
            />
          </div>
          <div className={styles.actionButtons}>
            <button
              className={styles.actionBtn}
              onClick={() => setShowSuppliersModal(true)}
            >
              <FaUsers /> Voir Fournisseurs
            </button>
            <button
              className={styles.actionBtn}
              onClick={() => setShowAddForm(true)}
            >
              <FaPlus /> Ajouter Fournisseur
            </button>
          </div>
        </div>

        {showAddForm && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <button
                className={styles.closeBtn}
                onClick={() => setShowAddForm(false)}
                aria-label="Fermer la modale"
              >
                ×
              </button>
              <h2>Ajouter un Fournisseur</h2>
              <form>
                <input
                  type="text"
                  placeholder="Nom du fournisseur"
                  value={newSupplier.name}
                  onChange={(e) =>
                    setNewSupplier({ ...newSupplier, name: e.target.value })
                  }
                  aria-label="Nom du fournisseur"
                />
                <input
                  type="tel"
                  placeholder="+212 6XX XXX XXX"
                  value={newSupplier.contact}
                  onChange={handleContactChange}
                  pattern="\+212\d{9}"
                  maxLength="13"
                  aria-label="Numéro de contact"
                />
                <button type="button" onClick={handleAddSupplier}>
                  Ajouter
                </button>
              </form>
            </div>
          </div>
        )}

        {showSelectionModal && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <button
                className={styles.closeBtn}
                onClick={() => setShowSelectionModal(false)}
                aria-label="Fermer la modale"
              >
                ×
              </button>
              <h2>Sélectionner des Produits pour {currentSupplier.name}</h2>
              <div className={styles.productsSelection}>
                {products.map((product) => (
                  <label key={product.id} className={styles.productCheckbox}>
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
          <div className={styles.modal}>
            <div className={`${styles.modalContent} ${styles.suppliersListModal}`}>
              <button
                className={styles.closeBtn}
                onClick={() => setShowSuppliersModal(false)}
                aria-label="Fermer la modale"
              >
                ×
              </button>
              <h2>Liste des Fournisseurs</h2>
              {suppliers.length > 0 ? (
                <ul className={styles.suppliersList}>
                  {suppliers.map((supplier) => (
                    <li key={supplier.id} className={styles.supplierItem}>
                      <div className={styles.supplierInfo}>
                        <span className={styles.supplierName}>{supplier.name}</span>
                        <div className={styles.contactInfo}>
                          <FaPhone className={styles.phoneIcon} />
                          <a
                            href={`tel:${supplier.contact}`}
                            className={styles.supplierContact}
                          >
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

        <table className={styles.table}>
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
              const supplierProducts = products.filter((p) => p.supplier === supplier.name);
              return (
                <tr key={supplier.id}>
                  <td>{supplier.name}</td>
                  <td>
                    <div className={styles.contactInfo}>
                      <FaPhone /> {formatPhoneNumber(supplier.contact)}
                    </div>
                  </td>
                  <td>
                    {supplierProducts.length > 0 ? (
                      <ul className={styles.productsList}>
                        {supplierProducts.map((product) => (
                          <li key={product.id}>
                            {product.name} ({product.quantity} {product.unit})
                            <button
                              className={styles.removeProductBtn}
                              onClick={() => {
                                setProducts((prev) =>
                                  prev.map((p) =>
                                    p.id === product.id ? { ...p, supplier: 'Non assigné' } : p
                                  )
                                );
                                setSuppliers((prev) =>
                                  prev.map((s) =>
                                    s.id === supplier.id
                                      ? {
                                          ...s,
                                          assignedProducts: s.assignedProducts.filter(
                                            (id) => id !== product.id
                                          ),
                                        }
                                      : s
                                  )
                                );
                              }}
                              aria-label={`Retirer ${product.name} du fournisseur ${supplier.name}`}
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
                    <div className={styles.actionButtons}>
                      <button
                        className={`${styles.actionBtn} ${styles.btnEdit}`}
                        onClick={() => handleAssignSupplier(supplier)}
                        aria-label={`Assigner des produits à ${supplier.name}`}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className={`${styles.actionBtn} ${styles.btnDelete}`}
                        onClick={() => handleDeleteSupplier(supplier.id)}
                        aria-label={`Supprimer ${supplier.name}`}
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
        {filteredSuppliers.length === 0 && (
          <p className={styles.noResults}>Aucun fournisseur trouvé.</p>
        )}
      </div>
    </div>
  );
}

export default Fournisseur;