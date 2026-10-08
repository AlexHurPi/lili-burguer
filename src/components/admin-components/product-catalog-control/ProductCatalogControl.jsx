import React from 'react';
import { useProductCatalogLogic } from './useProductCatalogLogic';
import { useMenu } from '../../../context/MenuContext';
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
    // Estados y funciones de la Galería Cloudflare R2
    isGalleryOpen,
    galleryImages,
    isLoadingGallery,
    setIsGalleryOpen,
    handleOpenGallery,
    handleSelectFromGallery,
    // Manejadores del formulario y catálogo
    handleInputChange,
    handleFileChange,
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

          {/* Cargador e Integración de Imagen */}
          <div className="form-group">
            <label className="form-label">Imagen del Producto:</label>
            <p className="image-notice-text">
              💡 Recomendación: Utiliza imágenes en formato liviano <strong>.webp</strong> optimizadas para móvil.
            </p>

            <div className="image-upload-wrapper">
              <label className="custom-file-upload">
                <input type="file" accept="image/*" onChange={handleFileChange} />
                📷 Tomar / Subir Foto Nueva
              </label>

              <button
                type="button"
                className="btn-open-gallery"
                onClick={handleOpenGallery}
              >
                📂 Elegir de Galería R2
              </button>
            </div>

            {/* Vista Previa de la Fotografía Seleccionada */}
            {(imagePreview || formData.imageUrl) && (
              <div className="image-preview-container">
                <p>Imagen Seleccionada:</p>
                <img
                  src={imagePreview || formData.imageUrl}
                  alt="Previsualización"
                  className="preview-thumbnail"
                  onError={(e) => (e.target.style.display = 'none')}
                />
              </div>
            )}
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

      {/* 🗑️ TARJETA 2: LISTA DE PRODUCTOS Y ELIMINACIÓN (PLEGABLE / ENCOGIBLE) */}
      <details className="catalog-card-section admin-collapsible-card">
        <summary className="catalog-header collapsible-summary">
          <div className="summary-title-wrapper">
            <h2>🗑️ Eliminación y Retiro de Productos</h2>
            <p>Consulta los productos existentes y retíralos de Firestore con confirmación.</p>
          </div>
          <span className="summary-icon">▼</span>
        </summary>

        <div className="categories-delete-list">
          {Object.keys(menuData?.cards || {}).map((catKey) => {
            const products = menuData.cards[catKey] || [];
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
          })}
        </div>
      </details>

      {/* 🖼️ MODAL DE GALERÍA R2 */}
      {isGalleryOpen && (
        <div className="media-modal-overlay">
          <div className="media-modal-content">
            <div className="media-modal-header">
              <h3>📂 Galería de Imágenes en Cloudflare R2</h3>
              <button
                type="button"
                className="btn-close-modal"
                onClick={() => setIsGalleryOpen(false)}
              >
                ✖
              </button>
            </div>

            {isLoadingGallery ? (
              <p className="loading-gallery-text">⏳ Cargando imágenes desde R2...</p>
            ) : galleryImages.length === 0 ? (
              <p className="loading-gallery-text">No hay imágenes en la carpeta /products de R2.</p>
            ) : (
              <div className="gallery-grid">
                {galleryImages.map((imgUrl, index) => (
                  <div
                    key={index}
                    className="gallery-item"
                    onClick={() => handleSelectFromGallery(imgUrl)}
                  >
                    <img src={imgUrl} alt={`R2 ${index}`} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCatalogControl;