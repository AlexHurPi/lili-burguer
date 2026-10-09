import React from 'react';
import { useProductCatalogLogic } from './useProductCatalogLogic';
import { useMenu } from '../../../context/MenuContext';
import { ImageSelectorR2 } from '../image-selector/ImageSelectorR2'; // 👈 Importamos el selector reusable
import CategoryOrderControl from './CategoryOrderControl';
import './productCatalogControl.css';

const ProductCatalogControl = () => {
  const { menuData } = useMenu();
  const {
    formData,
    categoriesList,
    imagePreview,
    isUploading,
    isSaving,
    deletingId,
    toast,
    // Manejadores del formulario y catálogo
    handleInputChange,
    handleFileChange,
    handleGallerySelect,
    handleCreateProduct,
    handleDeleteProduct
  } = useProductCatalogLogic();

  return (
    <div className="product-catalog-container">
      {/* Notificación Flotante (Toast) */}
      {toast.show && (
        <div className={`admin-toast ${toast.type}`}>
          {toast.type === 'success' ? '✅' : '⚠️'} {toast.message}
        </div>
      )}

      {/* ➕ TARJETA 1: FORMULARIO DE CREACIÓN (PLEGABLE / ENCOGIBLE) */}
      <details className="catalog-card-section admin-collapsible-card">
        <summary className="catalog-header collapsible-summary">
          <div className="summary-title-wrapper">
            <h2>➕ Agregar Nuevo Producto</h2>
            <p>Completa los campos para dar de alta un producto en el menú en vivo.</p>
          </div>
          <span className="summary-icon">▼</span>
        </summary>

        <form onSubmit={handleCreateProduct} className="catalog-form">
          {/* Asignación de Categoría */}
          <div className="form-group">
            <label className="form-label">Categoría del Producto:</label>
            <div className="category-selector-group">
              {!formData.isNewCategory ? (
                <select
                  className="form-control"
                  value={formData.categoryKey}
                  onChange={(e) => handleInputChange('categoryKey', e.target.value)}
                >
                  {categoriesList.map((cat) => (
                    <option key={cat.key} value={cat.key}>
                      {cat.title} ({cat.key})
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  className="form-control"
                  placeholder="Escribe el nombre de la nueva categoría (ej: Postres)"
                  value={formData.newCategoryTitle}
                  onChange={(e) => handleInputChange('newCategoryTitle', e.target.value)}
                  required
                />
              )}

              <button
                type="button"
                className="btn-toggle-category"
                onClick={() => handleInputChange('isNewCategory', !formData.isNewCategory)}
              >
                {formData.isNewCategory ? '⬅️ Elegir existente' : '➕ Nueva categoría'}
              </button>
            </div>
          </div>

          {/* Nombre y Descripción */}
          <div className="form-group">
            <label className="form-label">Nombre del Producto (productTitle): *</label>
            <input
              type="text"
              className="form-control"
              placeholder="Ej: Hamburguesa Doble Queso"
              value={formData.productTitle}
              onChange={(e) => handleInputChange('productTitle', e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Descripción / Ingredientes (description):</label>
            <textarea
              className="form-control textarea-control"
              placeholder="Ej: 200g de carne angus, queso cheddar doble, tocineta crujiente y salsa especial."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows="3"
            />
          </div>

          {/* Precios */}
          <div className="form-row-2col">
            <div className="form-group">
              <label className="form-label">Precio Regular ($):</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ej: 22.000"
                value={formData.regularPrice}
                onChange={(e) => handleInputChange('regularPrice', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Precio de Oferta ($):</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ej: 18.000"
                value={formData.offerPrice}
                onChange={(e) => handleInputChange('offerPrice', e.target.value)}
              />
            </div>
          </div>

          {/* Insignias de Promoción Opcionales */}
          <div className="form-row-2col">
            <div className="form-group">
              <label className="form-label">Insignia Superior (badgeText):</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ej: OFERTA ESPECIAL"
                value={formData.badgeText}
                onChange={(e) => handleInputChange('badgeText', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Etiqueta Porcentaje (discountBadge):</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ej: 20% OFF"
                value={formData.discountBadge}
                onChange={(e) => handleInputChange('discountBadge', e.target.value)}
              />
            </div>
          </div>

          {/* 🎯 COMPONENTE UNIFICADO DE SELECCIÓN DE IMAGEN R2 */}
          <div className="form-group">
            <ImageSelectorR2
              currentImage={imagePreview || formData.imageUrl}
              onImageChange={handleGallerySelect}
              onFileChange={handleFileChange}
            />
          </div>

          {/* Botón de Envío */}
          <button type="submit" className="btn-save-catalog" disabled={isSaving || isUploading}>
            {isUploading
              ? '📤 Subiendo imagen a Cloudflare...'
              : isSaving
              ? '⏳ Guardando producto...'
              : '🚀 Crear y Publicar Producto'}
          </button>
        </form>
      </details>

      {/* 🗑️ TARJETA 2: LISTA DE PRODUCTOS Y ELIMINACIÓN */}
      <details className="catalog-card-section admin-collapsible-card">
        <summary className="catalog-header collapsible-summary">
          <div className="summary-title-wrapper">
            <h2>🗑️ Eliminación y Retiro de Productos</h2>
            <p>Consulta los productos existentes y retíralos de Firestore con confirmación.</p>
          </div>
          <span className="summary-icon">▼</span>
        </summary>

        <div className="categories-delete-list">
          {(() => {
            // Extraemos y ordenamos las llaves según categoryOrder de Firestore
            const sortedCategoryKeys = Object.keys(menuData?.cards || {}).sort((a, b) => {
              const orderList = menuData?.categoryOrder || [];
              const indexA = orderList.indexOf(a);
              const indexB = orderList.indexOf(b);

              if (indexA !== -1 && indexB !== -1) return indexA - indexB;
              if (indexA !== -1) return -1;
              if (indexB !== -1) return 1;

              const numA = parseInt(a.replace(/\D/g, ''), 10) || 0;
              const numB = parseInt(b.replace(/\D/g, ''), 10) || 0;
              return numA - numB;
            });

            return sortedCategoryKeys.map((catKey) => {
              const products = menuData?.cards?.[catKey] || [];
              const catTitle = products[0]?.categoryTitle || `Categoría ${catKey}`;

              return (
                <details key={catKey} className="delete-category-accordion">
                  <summary className="accordion-summary">
                    <span>📂 {catTitle} ({products.length} productos)</span>
                  </summary>

                  <div className="category-products-grid">
                    {products.map((item) => (
                      <div key={item.id} className="delete-product-card">
                        <img
                          src={item.image || './images/products/default.webp'}
                          alt={item.productTitle}
                          className="delete-card-img"
                        />
                        <div className="delete-card-info">
                          <h4>{item.productTitle}</h4>
                          <p className="delete-card-price">
                            ${item.offerPrice || item.regularPrice || item.price}
                          </p>
                        </div>
                        <button
                          type="button"
                          className="btn-delete-product"
                          disabled={deletingId === item.id}
                          onClick={() => handleDeleteProduct(catKey, item.id)}
                        >
                          {deletingId === item.id ? '⏳' : '🗑️ Eliminar'}
                        </button>
                      </div>
                    ))}
                  </div>
                </details>
              );
            });
          })()}
        </div>
      </details>

      {/* COMPONENTE DE REORDENACIÓN DE CATEGORÍAS */}
      <CategoryOrderControl />
    </div>
  );
};

export default ProductCatalogControl;