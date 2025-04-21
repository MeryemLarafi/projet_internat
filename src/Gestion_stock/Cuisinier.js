import React, { useState, useEffect, useMemo } from "react";
import { FaSearch, FaFilter, FaEdit, FaUtensils, FaAppleAlt, FaBlender, FaBoxes, FaQuestion } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./Cuisinier.module.css";

function Cuisinier({ products, setProducts }) {
  const [search, setSearch] = useState("");
  const [selectedZone, setSelectedZone] = useState("Tous");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantityToUse, setQuantityToUse] = useState("");
  const [usedProducts, setUsedProducts] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [error, setError] = useState("");

  const zonesDisponibles = useMemo(() => {
    return ["Tous", ...new Set(products.map((p) => p.zone || "Non assigné"))];
  }, [products]);

  useEffect(() => {
    try {
      const storedUsedProducts = localStorage.getItem("usedProducts");
      if (storedUsedProducts) {
        setUsedProducts(JSON.parse(storedUsedProducts));
      }
    } catch (error) {
      console.error("Error reading usedProducts from localStorage:", error);
    }
  }, []);

  useEffect(() => {
    if (usedProducts.length > 0) {
      localStorage.setItem("usedProducts", JSON.stringify(usedProducts));
    }
  }, [usedProducts]);

  const filteredProducts = products.filter((product) => {
    const usedProduct = usedProducts.find((used) => used.id === product.id);
    const availableQuantity = usedProduct ? usedProduct.availableQuantity : product.quantity;

    const dateMatches =
      !selectedDate ||
      (usedProduct &&
        usedProduct.datesUsed.includes(selectedDate.toLocaleDateString("fr-FR")));

    const zoneMatch = selectedZone === "Tous" || (product.zone || "Non assigné") === selectedZone;

    return (
      availableQuantity >= 0 &&
      product.name.toLowerCase().includes(search.toLowerCase()) &&
      dateMatches &&
      zoneMatch
    );
  });

  const handleQuantityDecrease = (productId) => {
    const selected = products.find((product) => product.id === productId);
    const usedProduct = usedProducts.find((used) => used.id === selected.id);
    const availableQuantity = usedProduct ? usedProduct.availableQuantity : selected.quantity;
    const quantity = parseInt(quantityToUse);

    if (!quantity || quantity <= 0 || quantity > availableQuantity) {
      setError("Quantité invalide ou supérieure à la quantité disponible.");
      return;
    }

    const currentDate = new Date().toLocaleDateString("fr-FR");
    let updatedUsedProducts;

    if (usedProduct) {
      updatedUsedProducts = usedProducts.map((used) =>
        used.id === selected.id
          ? {
              ...used,
              usedQuantity: used.usedQuantity + quantity,
              availableQuantity: availableQuantity - quantity,
              datesUsed: [...(used.datesUsed || []), currentDate],
            }
          : used
      );
    } else {
      updatedUsedProducts = [
        ...usedProducts,
        {
          ...selected,
          zone: selected.zone || "Non assigné",
          usedQuantity: quantity,
          availableQuantity: availableQuantity - quantity,
          datesUsed: [currentDate],
        },
      ];
    }

    const updatedProducts = products.map((p) =>
      p.id === selected.id
        ? { ...p, quantity: availableQuantity - quantity }
        : p
    ).filter((p) => p.quantity >= 0);

    setUsedProducts(updatedUsedProducts);
    setProducts(updatedProducts);
    setQuantityToUse("");
    setSelectedProduct(null);
    setError("");
  };

  const getStatus = (product) => {
    const usedProduct = usedProducts.find((used) => used.id === product.id);
    const remainingQuantity = usedProduct ? usedProduct.availableQuantity : product.quantity;

    if (remainingQuantity <= 0) {
      return { className: styles.statusExpire, text: "Expiré" };
    } else if (remainingQuantity <= 5) {
      return { className: styles.statusProche, text: "Proche à Expirer" };
    } else {
      return { className: styles.statusBon, text: "Bon" };
    }
  };

  const getZoneTitle = () => {
    switch (selectedZone) {
      case "Economa 1":
        return { text: "Zone Economa 1", icon: <FaUtensils /> };
      case "Economa 2":
        return { text: "Zone Economa 2", icon: <FaUtensils /> };
      case "Fruit et Légume":
        return { text: "Zone Fruits et Légumes", icon: <FaAppleAlt /> };
      case "Matériel":
        return { text: "Zone Matériel", icon: <FaBlender /> };
      case "Tous":
        return { text: "Produits Disponibles", icon: <FaBoxes /> };
      case "Non assigné":
        return { text: "Zone Non Assignée", icon: <FaQuestion /> };
      default:
        return { text: `Zone ${selectedZone}`, icon: <FaUtensils /> };
    }
  };

  const zoneTitle = getZoneTitle();

  return (
    <div className={styles.container}>
      <div className={styles.controlsContainer}>
        <div className={styles.searchZoneContainer}>
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
          <select
            className={styles.zoneSelect}
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            aria-label="Sélectionner une zone"
          >
            {zonesDisponibles.map((zone, index) => (
              <option key={index} value={zone}>
                {zone}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.filterContainer}>
          {showDatePicker && (
            <div className={styles.datePickerContainer}>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => {
                  setSelectedDate(date);
                  setShowDatePicker(false);
                }}
                placeholderText="Sélectionner une date"
                dateFormat="dd/MM/yyyy"
                className={styles.datePicker}
                maxDate={new Date()}
                aria-label="Sélectionner une date d'utilisation"
              />
            </div>
          )}
          <button
            className={styles.filterButton}
            onClick={() => setShowDatePicker(!showDatePicker)}
            aria-label="Filtrer par date"
          >
            <FaFilter />
          </button>
        </div>
      </div>

      {selectedProduct && (
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>{selectedProduct.name}</h3>
          <p className={styles.cardText}>
            Quantité disponible :{" "}
            {(() => {
              const usedProduct = usedProducts.find(
                (used) => used.id === selectedProduct.id
              );
              return usedProduct
                ? usedProduct.availableQuantity
                : selectedProduct.quantity;
            })()}{" "}
            {selectedProduct.unit}
          </p>
          <p className={styles.cardText}>
            Zone : {selectedProduct.zone || "Non assigné"}
          </p>
          <div className={styles.cardInputContainer}>
            <input
              type="number"
              placeholder="Quantité à utiliser"
              value={quantityToUse}
              onChange={(e) => setQuantityToUse(e.target.value)}
              className={styles.cardInput}
              min="1"
              aria-label="Quantité à utiliser"
              aria-invalid={!!error}
              aria-describedby={error ? "quantity-error" : undefined}
            />
            <button
              className={`${styles.actionBtn} ${styles.cardActionBtn}`}
              onClick={() => handleQuantityDecrease(selectedProduct.id)}
              disabled={!quantityToUse}
              aria-label={`Utiliser ${selectedProduct.name}`}
            >
              Utiliser
            </button>
          </div>
          {error && (
            <span id="quantity-error" className={styles.error}>
              {error}
            </span>
          )}
        </div>
      )}

      <div className={styles.zone}>
        <h2 className={styles.zoneTitle}>
          {zoneTitle.icon} {zoneTitle.text}
        </h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nom du Produit</th>
              <th>Zone</th>
              <th>Quantité Disponible</th>
              <th>Quantité Utilisée</th>
              <th>État</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => {
              const { className, text } = getStatus(p);
              const usedProduct = usedProducts.find((used) => used.id === p.id);
              const usedQuantity = usedProduct ? usedProduct.usedQuantity : 0;
              const availableQuantity = usedProduct
                ? usedProduct.availableQuantity
                : p.quantity;

              return (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.zone || "Non assigné"}</td>
                  <td>
                    {availableQuantity} {p.unit}
                  </td>
                  <td>{usedQuantity}</td>
                  <td>
                    <span className={className}>{text}</span>
                  </td>
                  <td>
                    <button
                      className={`${styles.actionIcon} ${styles.tableActionBtn}`}
                      onClick={() => setSelectedProduct(p)}
                      disabled={availableQuantity <= 0}
                      title="Sélectionner"
                      aria-label={`Sélectionner ${p.name}`}
                    >
                      <FaEdit />
                    </button>
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
    </div>
  );
}

export default Cuisinier;