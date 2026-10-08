//** Este componente se utiliza para manejar la reordenación de las categorías en el menú. 
//* Permite arrastrar y soltar las categorías para cambiar su orden */

import React from 'react';
import { useCategoryOrderLogic } from './useCategoryOrderLogic';
import './categoryOrderControl.css';

const CategoryOrderControl = () => {
  const {
    orderedKeys,
    menuData,
    isSaving,
    toast,
    moveCategory,
    handleSaveOrder
  } = useCategoryOrderLogic();

  return (
    <details className="catalog-card-section admin-collapsible-card">
      <summary className="catalog-header collapsible-summary">
        <div className="summary-title-wrapper">
          <h2>↕️ Reordenar Secuencia de Categorías</h2>
          <p>Organiza la posición visual en la que aparecerán las secciones en el menú.</p>
        </div>
        <span className="summary-icon">▼</span>
      </summary>

      {toast.show && (
        <div className={`admin-toast ${toast.type}`}>
          {toast.type === 'success' ? '✅' : '⚠️'} {toast.message}
        </div>
      )}

      <div className="category-order-list">
        {orderedKeys.map((catKey, index) => {
          const products = menuData?.cards?.[catKey] || [];
          const catTitle = products[0]?.categoryTitle || `Categoría ${catKey}`;

          return (
            <div key={catKey} className="category-order-item">
              <div className="category-order-info">
                <span className="order-badge">#{index + 1}</span>
                <span className="category-title-text">{catTitle}</span>
                <span className="products-count">({products.length} ítems)</span>
              </div>

              <div className="order-actions-btns">
                <button
                  type="button"
                  className="btn-order-move"
                  disabled={index === 0}
                  onClick={() => moveCategory(index, 'UP')}
                  title="Subir categoría"
                >
                  🔼
                </button>

                <button
                  type="button"
                  className="btn-order-move"
                  disabled={index === orderedKeys.length - 1}
                  onClick={() => moveCategory(index, 'DOWN')}
                  title="Bajar categoría"
                >
                  🔽
                </button>
              </div>
            </div>
          );
        })}

        <button
          type="button"
          className="btn-save-catalog"
          disabled={isSaving}
          onClick={handleSaveOrder}
        >
          {isSaving ? '⏳ Guardando orden...' : '💾 Guardar Nuevo Orden'}
        </button>
      </div>
    </details>
  );
};

export default CategoryOrderControl;