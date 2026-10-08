/** @description: Este componente se utiliza para manejar el inventario de la tienda, permitiendo agregar,
editar y eliminar productos de la base de datos.*/

import React from 'react';
import { useInventoryLogic } from './useInventoryLogic';
import { ProductEditModal } from './ProductEditModal';
import { useMenu } from '../../../context/MenuContext'; // 👈 Leemos menuData para la secuencia global
import './inventoryControl.css';

const InventoryControl = () => {
  const { menuData } = useMenu();
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

  // Extraemos y ordenamos las llaves de las categorías según la secuencia global
  const sortedCategoryKeys = Object.keys(cardsState || {}).sort((a, b) => {
    const orderList = menuData?.categoryOrder || [];
    const indexA = orderList.indexOf(a);
    const indexB = orderList.indexOf(b);

    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;

    // Fallback numérico en caso de que alguna clave no esté registrada
    const numA = parseInt(a.replace(/\D/g, ''), 10) || 0;
    const numB = parseInt(b.replace(/\D/g, ''), 10) || 0;
    return numA - numB;
  });

  // Si no hay productos cargados, mostrar un estado de carga
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
        {sortedCategoryKeys.map((catKey) => {
          const rawProducts = cardsState[catKey] || [];
          const catTitle = rawProducts[0]?.categoryTitle || catKey.toUpperCase();
          const isOpen = openCategory === catKey;
          const isSaving = savingCategory === catKey;

          // 🔹 ORDENAMIENTO DINÁMICO DE PRODUCTOS DENTRO DE LA CATEGORÍA
          const sortedProducts = [...rawProducts].sort((a, b) => {
            const orderA = a.order !== undefined && a.order !== null ? Number(a.order) : 9999;
            const orderB = b.order !== undefined && b.order !== null ? Number(b.order) : 9999;

            if (orderA !== orderB) {
              return orderA - orderB;
            }

            const titleA = (a.productTitle || '').toLowerCase();
            const titleB = (b.productTitle || '').toLowerCase();
            return titleA.localeCompare(titleB);
          });

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
                  <span className="product-count">({sortedProducts.length} ítems)</span>
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
                    {sortedProducts.map((product) => {
                      // Obtenemos el índice real del producto dentro del arreglo original de la categoría
                      // para garantizar que el toggle afecte al producto correcto en el estado local
                      const originalIndex = rawProducts.findIndex(
                        (p) => (p.id && p.id === product.id) || p.productTitle === product.productTitle
                      );

                      const isStock = product.stock !== false;
                      const isAvailable = product.available !== false;

                      return (
                        <div
                          className={`compact-item-row ${!isStock ? 'row-out-stock' : ''} ${!isAvailable ? 'row-hidden' : ''}`}
                          key={product.id || product.productTitle}
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
                                onChange={() => handleQuickToggle(catKey, originalIndex, 'stock')}
                              />
                              <span className="slider-mini"></span>
                            </label>

                            <label className="switch-control-mini" title="Visible / Oculto">
                              <input
                                type="checkbox"
                                checked={isAvailable}
                                onChange={() => handleQuickToggle(catKey, originalIndex, 'available')}
                              />
                              <span className="slider-mini"></span>
                            </label>

                            <button
                              type="button"
                              className="btn-edit-item"
                              onClick={() => setEditingItem({ catKey, index: originalIndex, product })}
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