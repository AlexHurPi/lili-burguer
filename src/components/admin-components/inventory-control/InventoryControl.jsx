/** @description: Este componente se utiliza para manejar el inventario de la tienda, permitiendo agregar,
editar y eliminar productos de la base de datos.*/

import React from 'react';
import { useInventoryLogic } from './useInventoryLogic';
import { ProductEditModal } from './ProductEditModal';
import './inventoryControl.css';

const InventoryControl = () => {
  const {
    cardsState,
    openCategory,
    savingCategory,
    editingItem,
    toast,
    setEditingItem,
    toggleCategory,
    handleQuickToggle,
    handleUpdateProductFromModal,
    handleSaveCategory
  } = useInventoryLogic();

  if (!cardsState || Object.keys(cardsState).length === 0) {
    return (
      <div className="inventory-empty-state">
        <p>Cargando productos de la base de datos...</p>
      </div>
    );
  }

  return (
    <div className="inventory-control-card">
      {/* Toast Flotante Fijo */}
      {toast.show && (
        <div className={`inventory-toast-floating ${toast.type}`}>
          <span>{toast.type === 'success' ? '✅' : '⚠'} {toast.message}</span>
        </div>
      )}

      <div className="inventory-header">
        <h2>📦 Control de Stock y Precios</h2>
        <p>Gestiona stock inmediato, visibilidad y precios rápidos de tu menú.</p>
      </div>

      <div className="categories-accordion-wrapper">
        {Object.entries(cardsState).map(([catKey, products]) => {
          const catTitle = products[0]?.categoryTitle || catKey.toUpperCase();
          const isOpen = openCategory === catKey;
          const isSaving = savingCategory === catKey;

          return (
            <div className="category-accordion-item" key={catKey}>
              {/* Encabezado del Acordeón */}
              <button
                type="button"
                className={`accordion-header-btn ${isOpen ? 'active' : ''}`}
                onClick={() => toggleCategory(catKey)}
              >
                <div className="header-title-group">
                  <span className="accordion-icon">{isOpen ? '📂' : '📁'}</span>
                  <h3>{catTitle}</h3>
                  <span className="product-count">({products.length} ítems)</span>
                </div>
                <span className="accordion-chevron">{isOpen ? '▲' : '▼'}</span>
              </button>

              {/* Contenido del Acordeón (Lista Compacta) */}
              {isOpen && (
                <div className="accordion-body-content">
                  
                  {/* 🟢 Leyenda Informativa Superior */}
                  <div className="list-legend-header">
                    <span>Producto / Precio</span>
                    <span>🟢 Stock &nbsp; 👁️ Ver &nbsp; ✏️ Editar</span>
                  </div>

                  <div className="compact-products-list">
                    {products.map((product, index) => {
                      const isStock = product.stock !== false;
                      const isAvailable = product.available !== false;

                      return (
                        <div
                          className={`compact-item-row ${!isStock ? 'row-out-stock' : ''} ${!isAvailable ? 'row-hidden' : ''}`}
                          key={product.id || index}
                        >
                          <div className="compact-left-info">
                            {product.image && (
                              <img src={product.image} alt={product.productTitle} className="compact-thumb" />
                            )}
                            <div className="compact-titles">
                              <h4>{product.productTitle}</h4>
                              <span className="compact-price-tag">
                                ${product.offerPrice || product.regularPrice}
                              </span>
                            </div>
                          </div>

                          {/* Controls rápidos: Switches y Botón Editar */}
                          <div className="compact-right-controls">
                            <label className="switch-control-mini" title="En Stock / Agotado">
                              <input
                                type="checkbox"
                                checked={isStock}
                                onChange={() => handleQuickToggle(catKey, index, 'stock')}
                              />
                              <span className="slider-mini"></span>
                            </label>

                            <label className="switch-control-mini" title="Visible / Oculto">
                              <input
                                type="checkbox"
                                checked={isAvailable}
                                onChange={() => handleQuickToggle(catKey, index, 'available')}
                              />
                              <span className="slider-mini"></span>
                            </label>

                            <button
                              type="button"
                              className="btn-edit-item"
                              onClick={() => setEditingItem({ catKey, index, product })}
                              title="Editar detalles completos"
                            >
                              ✏️
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Guardar Categoría */}
                  <div className="category-save-footer">
                    <button
                      type="button"
                      className="btn-save-category"
                      disabled={isSaving}
                      onClick={() => handleSaveCategory(catKey)}
                    >
                      {isSaving ? (
                        <span className="spinner-loading">⌛ Guardando en Firestore...</span>
                      ) : (
                        `💾 GUARDAR ${catTitle.toUpperCase()}`
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal de Edición */}
      {editingItem && (
        <ProductEditModal
          itemData={editingItem}
          onClose={() => setEditingItem(null)}
          onSave={handleUpdateProductFromModal}
        />
      )}
    </div>
  );
};

export default InventoryControl;