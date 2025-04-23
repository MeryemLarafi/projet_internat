import React, { useState, useEffect } from "react";
import { FaSearch, FaPlus, FaEye, FaEdit, FaTrash, FaFileExport } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import styles from "./StockGlobal.module.css";

function StockGlobal({ products, setProducts }) {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [showExpirationDate, setShowExpirationDate] = useState(false);
  const [product, setProduct] = useState({
    name: "",
    price: "",
    quantity: "",
    unit: "",
    supplier: "",
    zone: "",
    date: "",
    expirationDate: "",
  });

  useEffect(() => {
    if (!showForm) {
      setProduct({
        name: "",
        price: "",
        quantity: "",
        unit: "",
        supplier: "",
        zone: "",
        date: "",
        expirationDate: "",
      });
      setShowExpirationDate(false);
      setEditProductId(null);
    }
  }, [showForm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const availableSuppliers = (() => {
    try {
      const savedSuppliers = localStorage.getItem("suppliers");
      if (!savedSuppliers) return [];
      const parsed = JSON.parse(savedSuppliers);
      return Array.isArray(parsed) ? parsed.map((s) => s.name) : [];
    } catch (error) {
      console.error("Error reading suppliers from localStorage:", error);
      return [];
    }
  })();

  const zones = [
    "Economa 1",
    "Economa 2",
    "Fruit et Légume",
    "Matériel",
    "Non assigné",
  ];

  const addProduct = () => {
    const { name, price, quantity, unit, supplier, zone, date } = product;
    if (!name || !price || !quantity || !unit || !supplier || !date) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    if (parseInt(price) < 1 || parseInt(quantity) < 1) {
      alert("Le prix et la quantité doivent être des nombres entiers supérieurs ou égaux à 1.");
      return;
    }

    const newProduct = {
      ...product,
      id: Date.now(),
      price: parseInt(price),
      quantity: parseInt(quantity),
      totalPrice: parseInt(price) * parseInt(quantity),
      zone: zone || "Non assigné",
      expirationDate: product.expirationDate || "",
    };

    setProducts([...products, newProduct]);
    setShowForm(false);
  };

  const updateProduct = () => {
    const { name, price, quantity, unit, supplier, zone, date } = product;
    if (!name || !price || !quantity || !unit || !supplier || !date) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    if (parseInt(price) < 1 || parseInt(quantity) < 1) {
      alert("Le prix et la quantité doivent être des nombres entiers supérieurs ou égaux à 1.");
      return;
    }

    const updatedProducts = products.map((p) =>
      p.id === editProductId
        ? {
            ...p,
            name,
            price: parseInt(price),
            quantity: parseInt(quantity),
            totalPrice: parseInt(price) * parseInt(quantity),
            unit,
            supplier,
            zone: zone || "Non assigné",
            date,
            expirationDate: product.expirationDate || "",
          }
        : p
    );

    setProducts(updatedProducts);
    setShowForm(false);
  };

  const deleteProduct = (productId) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce produit ?")) {
      setProducts(products.filter((product) => product.id !== productId));
    }
  };

  const editProduct = (product) => {
    setProduct({
      name: product.name || "",
      price: product.price ? product.price.toString() : "",
      quantity: product.quantity ? product.quantity.toString() : "",
      unit: product.unit || "",
      supplier: product.supplier || "",
      zone: product.zone || "Non assigné",
      date: product.date || "",
      expirationDate: product.expirationDate || "",
    });
    setShowExpirationDate(!!product.expirationDate);
    setEditProductId(product.id);
    setShowForm(true);
  };

  const viewProductDetails = (product) => {
    alert(
      `Détails du produit :\n` +
      `- Nom : ${product.name}\n` +
      `- Quantité : ${product.quantity} ${product.unit}\n` +
      `- Prix unitaire : ${product.price} DH\n` +
      `- Prix total : ${product.totalPrice} DH\n` +
      `- Fournisseur : ${product.supplier}\n` +
      `- Zone : ${product.zone || "Non spécifiée"}\n` +
      `- Date d'entrée : ${product.date}\n` +
      `- Date d'expiration : ${product.expirationDate || "Non spécifiée"}`
    );
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Liste des Produits", 14, 20);
    autoTable(doc, {
      startY: 30,
      head: [
        [
          "Nom",
          "Quantité",
          "Prix Total",
          "Fournisseur",
          "Zone",
          "Date d'entrée",
          "Date d'expiration",
          "État",
        ],
      ],
      body: products.map((p) => [
        p.name,
        `${p.quantity} ${p.unit}`,
        `${p.totalPrice} DH`,
        p.supplier,
        p.zone || "Non spécifiée",
        p.date,
        p.expirationDate || "Non spécifiée",
        getStatus(p).text,
      ]),
    });
    doc.save("stock_global.pdf");
  };

  const getStatus = (product) => {
    if (!product.expirationDate) {
      return { className: styles.statusBon, text: "Bon" };
    }
    const today = new Date();
    const expDate = new Date(product.expirationDate);
    const diffDays = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) {
      return { className: styles.statusExpire, text: "Expiré" };
    } else if (diffDays <= 7) {
      return { className: styles.statusProche, text: "Proche à Expirer" };
    } else {
      return { className: styles.statusBon, text: "Bon" };
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().startsWith(search.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.controlsContainer}>
        <div className={styles.searchContainer}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Rechercher un produit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Rechercher un produit"
          />
        </div>
        <div className={styles.actionButtons}>
          <button
            className={styles.actionBtn}
            onClick={() => {
              setShowForm(true);
              setEditProductId(null);
            }}
          >
            <FaPlus /> Ajouter
          </button>
          <button className={styles.actionBtn} onClick={exportToPDF}>
            <FaFileExport /> Exporter
          </button>
        </div>
      </div>

      {showForm && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <button
              className={styles.closeBtn}
              onClick={() => {
                setShowForm(false);
                setEditProductId(null);
                setShowExpirationDate(false);
              }}
              aria-label="Fermer la modale"
            >
              ×
            </button>
            <h2>{editProductId ? "Modifier le Produit" : "Ajouter un Produit"}</h2>
            <form className={styles.form}>
              <div className={styles.formGroup}>
                <label>Nom du produit</label>
                <input
                  type="text"
                  name="name"
                  value={product.name}
                  onChange={handleChange}
                  className={styles.formInput}
                  required
                  aria-label="Nom du produit"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Prix unitaire (DH)</label>
                <input
                  type="number"
                  name="price"
                  value={product.price}
                  onChange={handleChange}
                  min="1"
                  step="1"
                  className={styles.formInput}
                  required
                  aria-label="Prix unitaire"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Quantité</label>
                <input
                  type="number"
                  name="quantity"
                  value={product.quantity}
                  onChange={handleChange}
                  min="1"
                  step="1"
                  className={styles.formInput}
                  required
                  aria-label="Quantité"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Unité</label>
                <select
                  name="unit"
                  value={product.unit}
                  onChange={handleChange}
                  className={styles.formSelect}
                  required
                  aria-label="Unité"
                >
                  <option value="">Sélectionner l'unité</option>
                  <option value="kg">kg</option>
                  <option value="g">g</option>
                  <option value="L">L</option>
                  <option value="piece">Pièce</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Fournisseur</label>
                <select
                  name="supplier"
                  value={product.supplier}
                  onChange={handleChange}
                  className={styles.formSelect}
                  required
                  aria-label="Fournisseur"
                >
                  <option value="">Sélectionner un fournisseur</option>
                  {availableSuppliers.map((supplier, index) => (
                    <option key={index} value={supplier}>
                      {supplier}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Zone</label>
                <select
                  name="zone"
                  value={product.zone}
                  onChange={handleChange}
                  className={styles.formSelect}
                  aria-label="Zone"
                >
                  <option value="">Sélectionner une zone</option>
                  {zones.map((zone, index) => (
                    <option key={index} value={zone}>
                      {zone}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Date d'entrée</label>
                <input
                  type="date"
                  name="date"
                  value={product.date}
                  onChange={handleChange}
                  className={styles.formInput}
                  required
                  aria-label="Date d'entrée"
                />
              </div>
              <div className={styles.formGroup}>
                <label>
                  <input
                    type="checkbox"
                    checked={showExpirationDate}
                    onChange={() => setShowExpirationDate(!showExpirationDate)}
                  />
                  Ajouter une date d'expiration
                </label>
                {showExpirationDate && (
                  <input
                    type="date"
                    name="expirationDate"
                    value={product.expirationDate}
                    onChange={handleChange}
                    className={styles.formInput}
                    aria-label="Date d'expiration"
                  />
                )}
              </div>
              <button
                type="button"
                className={styles.actionBtn}
                onClick={editProductId ? updateProduct : addProduct}
                aria-label={editProductId ? "Modifier le produit" : "Ajouter le produit"}
              >
                {editProductId ? "Modifier" : "Ajouter Produit"}
              </button>
            </form>
          </div>
        </div>
      )}

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Quantité</th>
            <th>Prix Total</th>
            <th>Fournisseur</th>
            <th>Zone</th>
            <th>Date d'entrée</th>
            <th>Date d'expiration</th>
            <th>État</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((p) => {
            const { className, text } = getStatus(p);
            return (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>
                  {p.quantity} {p.unit}
                </td>
                <td>{p.totalPrice} DH</td>
                <td>{p.supplier}</td>
                <td>{p.zone}</td>
                <td>{p.date}</td>
                <td>{p.expirationDate || "Non spécifiée"}</td>
                <td>
                  <span className={className}>{text}</span>
                </td>
                <td>
                  <div className={styles.actionButtons}>
                    <button
                      className={`${styles.actionIcon} ${styles.btnView}`}
                      onClick={() => viewProductDetails(p)}
                      title="Voir détails"
                      aria-label={`Voir détails de ${p.name}`}
                    >
                      <FaEye />
                    </button>
                    <button
                      className={`${styles.actionIcon} ${styles.btnEdit}`}
                      onClick={() => editProduct(p)}
                      title="Modifier"
                      aria-label={`Modifier ${p.name}`}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className={`${styles.actionIcon} ${styles.btnDelete}`}
                      onClick={() => deleteProduct(p.id)}
                      title="Supprimer"
                      aria-label={`Supprimer ${p.name}`}
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
      {filteredProducts.length === 0 && (
        <p className={styles.noResults}>Aucun produit trouvé.</p>
      )}
    </div>
  );
}

export default StockGlobal;