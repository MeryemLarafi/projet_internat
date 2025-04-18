import React, { useState, useEffect } from "react";
import { FaSearch, FaFilter } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Cuisinier.css";

function Cuisinier({ products }) {
  const [search, setSearch] = useState("");
  const [selectedZone, setSelectedZone] = useState("Tous");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantityToUse, setQuantityToUse] = useState(0);
  const [usedProducts, setUsedProducts] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const zonesDisponibles = ["Tous", ...new Set(products.map(p => p.zone || "Non assigné"))];

  useEffect(() => {
    const storedUsedProducts = JSON.parse(localStorage.getItem("usedProducts"));
    if (storedUsedProducts) {
      setUsedProducts(storedUsedProducts);
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
      (usedProduct && usedProduct.datesUsed.includes(selectedDate.toLocaleDateString()));

    const zoneMatch = selectedZone === "Tous" || (product.zone || "Non assigné") === selectedZone;

    return (
      availableQuantity >= 0 &&
      product.name.toLowerCase().startsWith(search.toLowerCase()) &&
      dateMatches &&
      zoneMatch
    );
  });

  const handleQuantityDecrease = (productId) => {
    const selected = products.find((product) => product.id === productId);
    const usedProduct = usedProducts.find((used) => used.id === selected.id);
    const availableQuantity = usedProduct ? usedProduct.availableQuantity : selected.quantity;

    if (quantityToUse <= 0 || quantityToUse > availableQuantity) {
      alert("Quantité invalide.");
      setQuantityToUse(0);
      return;
    }

    const currentDate = new Date().toLocaleDateString();

    if (usedProduct) {
      const updatedUsedProducts = usedProducts.map((used) =>
        used.id === selected.id
          ? {
              ...used,
              usedQuantity: used.usedQuantity + quantityToUse,
              availableQuantity: availableQuantity - quantityToUse,
              datesUsed: [...(used.datesUsed || []), currentDate],
            }
          : used
      );
      setUsedProducts(updatedUsedProducts);
    } else {
      const newUsedProduct = {
        ...selected,
        zone: selected.zone || "Non assigné",
        usedQuantity: quantityToUse,
        availableQuantity: availableQuantity - quantityToUse,
        datesUsed: [currentDate],
      };
      setUsedProducts([...usedProducts, newUsedProduct]);
    }

    setQuantityToUse(0);
    setSelectedProduct(null);
  };

  const getStatus = (product) => {
    const usedProduct = usedProducts.find((used) => used.id === product.id);
    const remainingQuantity = usedProduct ? usedProduct.availableQuantity : product.quantity;

    if (remainingQuantity <= 0) {
      return { className: "status status-expire", text: "Expiré" };
    } else if (remainingQuantity <= 5) {
      return { className: "status status-proche", text: "Proche à Expirer" };
    } else {
      return { className: "status status-bon", text: "Bon" };
    }
  };

  const getZoneTitle = () => {
    switch (selectedZone) {
      case "Economa 1":
        return { text: "Zone Economa 1", icon: "fas fa-utensils" }; // Fork and knife
      case "Economa 2":
        return { text: "Zone Economa 2", icon: "fas fa-utensils" }; // Fork and knife
      case "Fruit et Légume":
        return { text: "Zone Fruits et Légumes", icon: "fas fa-apple-alt" }; // Apple
      case "Matériel":
        return { text: "Zone Matériel", icon: "fas fa-blender" }; // Blender
      case "Tous":
        return { text: "Produits Disponibles", icon: "fas fa-boxes" }; // Boxes
      case "Non assigné":
        return { text: "Zone Non Assignée", icon: "fas fa-question" }; // Question mark
      default:
        return { text: `Zone ${selectedZone}`, icon: "fas fa-utensils" };
    }
  };

  const zoneTitle = getZoneTitle();

  return (
    <div className="container">
      <div className="controls-container">
        <div className="search-zone-container">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Rechercher un produit..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="zone-select"
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
          >
            {zonesDisponibles.map((zone, index) => (
              <option key={index} value={zone}>
                {zone}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-container">
          {showDatePicker && (
            <div className="date-picker-container">
              <DatePicker
                selected={selectedDate}
                onChange={(date) => {
                  setSelectedDate(date);
                  setShowDatePicker(false);
                }}
                placeholderText="Sélectionner une date"
                dateFormat="dd/MM/yyyy"
                className="date-picker"
              />
            </div>
          )}
          <button
            className="filter-button"
            onClick={() => setShowDatePicker(!showDatePicker)}
          >
            <FaFilter />
          </button>
        </div>
      </div>

      {selectedProduct && (
        <div className="card">
          <h3 className="card-title">{selectedProduct.name}</h3>
          <p className="card-text">
            Quantité disponible : {(() => {
              const usedProduct = usedProducts.find((used) => used.id === selectedProduct.id);
              return usedProduct ? usedProduct.availableQuantity : selectedProduct.quantity;
            })()} {selectedProduct.unit}
          </p>
          <p className="card-text">Zone : {selectedProduct.zone || "Non assigné"}</p>
          <div className="card-input-container">
            <input
              type="number"
              placeholder="Quantité à utiliser"
              value={quantityToUse}
              onChange={(e) => setQuantityToUse(Math.max(0, parseInt(e.target.value) || 0))}
              className="card-input"
            />
            <button
              className="action-btn card-action-btn"
              onClick={() => handleQuantityDecrease(selectedProduct.id)}
            >
              Utiliser
            </button>
          </div>
        </div>
      )}

      <div className="zone active">
        <h2 className="zone-title">
          <i className={zoneTitle.icon}></i> {zoneTitle.text}
        </h2>
        <table className="table">
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
              const availableQuantity = usedProduct ? usedProduct.availableQuantity : p.quantity;

              return (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.zone || "Non assigné"}</td>
                  <td>{availableQuantity} {p.unit}</td>
                  <td>{usedQuantity}</td>
                  <td>
                    <span className={className}>{text}</span>
                  </td>
                  <td>
                    <button
                      className="action-btn table-action-btn"
                      onClick={() => setSelectedProduct(p)}
                      disabled={availableQuantity <= 0}
                    >
                      <i className="fas fa-edit"></i> Sélectionner
                    </button>
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

export default Cuisinier;